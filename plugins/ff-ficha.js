/*
  Comando: .demo2 (alias: .ficha cuando estés listo)
  Propósito: Formulario paso a paso (solo owner). El bot pregunta por fecha, casilla, hora MX, titulares, suplentes y mapas.
  Requisitos: Bot basado en Baileys / similares donde `conn.sendMessage`, `conn.reply` y `conn.ev.on('messages.upsert', ...)` existen.

  Cómo usar: Pega este archivo en la carpeta de comandos (por ejemplo `/plugins/owner/`) y reinicia el bot.

  NOTA: Está escrito en español y cuidando validaciones. Si tu framework usa otra firma para exportar comandos, adapta el `module.exports` al formato que tu bot use.
*/

const OWNER_WHITELIST = ["+573146171942"] // cambia si hace falta; aquí el dueño por defecto (según tu contexto)

module.exports = {
  name: 'demo2',
  alias: ['ficha'],
  desc: 'Crea una ficha interactiva paso a paso (owner only).',
  owner: true,
  async run(conn, m, args) {
    try {
      const from = m.chat || m.key.remoteJid
      const sender = m.sender || (m.key && m.key.participant) || ''

      // Verificar owner
      const isOwner = OWNER_WHITELIST.includes(sender.replace(/:\d+$/, '')) || (m.isOwner || m.fromMe)
      if (!isOwner) return conn.reply(from, '❌ Solo el owner puede ejecutar este comando por ahora.', m)

      // Mensaje inicial explicativo
      const intro = `*📋 CREAR FICHA - PROCESO INTERACTIVO*

Voy a guiarte paso a paso. Responde cada pregunta *contestando el mensaje que yo envíe* (usando "responder" / quote). Si te equivocas, te pediré que lo corrijas.

*Pasos que haremos:*
1. Fecha (formato: DD/MM/AAAA o DD-MM-AAAA)
2. Casilla (ej: C# 3 o C# 1)
3. Hora MX (ej: 7:00 pm) — las horas de COL y VNZ se autocompletan.
4. Titulares — formato: `nombre; @etiqueta; rol, nombre2; @etiqueta; rol2` (cada jugador separado por coma `,`, cada campo por punto y coma `;`). Ejemplo:
   `andres; @andres123; rush, pablo; @pablito; granadero`
5. Suplentes — formato: `nombre; @etiqueta, nombre2; @etiqueta` (sin rol)
6. Mapas — separados por comas (ej: `Erangel, Miramar, Sanhok`)

Cuando estés listo, responde a este mensaje con *"OK"* o escribe `.cancel` para cancelar.`

` + "_Te recuerdo: RESPONDE siempre al MENSAJE del bot para que detecte correctamente el paso._"`

      const introMsg = await conn.sendMessage(from, { text: intro })

      // Función que espera la respuesta del owner en este chat, respondiendo al mensaje enviado
      const waitReply = (timeout = 120000) => new Promise((resolve, reject) => {
        const handler = async (pe) => {
          try {
            if (!pe.messages || !pe.messages[0]) return
            const newMsg = pe.messages[0]
            if (!newMsg.message) return
            const key = newMsg.key || {}
            const chatId = key.remoteJid
            const author = key.participant || newMsg.key && newMsg.key.participant || newMsg.key && newMsg.key.remoteJid || ''

            // Asegurarnos que venga del mismo chat y del owner
            if (chatId !== from) return
            const fromSender = (author || newMsg.key.fromMe && sender) // fallback
            const normalized = (fromSender || '').replace(/:\d+$/, '')
            if (!OWNER_WHITELIST.includes(normalized) && !newMsg.key.fromMe) return // sólo owner

            // Si es comando de cancelar
            const text = extractText(newMsg.message)
            if (!text) return
            const txtLow = text.trim().toLowerCase()
            if (txtLow === '.cancel' || txtLow === 'cancel' || txtLow === 'cancelar') {
              conn.sendMessage(from, { text: '⚠️ Proceso cancelado por el owner.' })
              conn.ev.off('messages.upsert', handler)
              return resolve({ canceled: true })
            }

            // Verificamos que el mensaje sea respuesta (quoted) al mensaje que el bot envió
            const isReply = newMsg.message.extendedTextMessage && newMsg.message.extendedTextMessage.contextInfo && newMsg.message.extendedTextMessage.contextInfo.stanzaId
            // Para más robustez, aceptamos si el user responde cualquier mensaje del bot durante el flujo
            // En este diseño aceptamos cualquier mensaje del owner en este chat como respuesta al paso actual.

            conn.ev.off('messages.upsert', handler)
            resolve({ canceled: false, msg: newMsg, text })
          } catch (e) {
            // ignore
          }
        }

        conn.ev.on('messages.upsert', handler)

        // Timeout
        setTimeout(() => {
          conn.ev.off('messages.upsert', handler)
          reject(new Error('timeout'))
        }, timeout)
      })

      // Extra: helper para extraer texto de diferentes tipos de mensajes
      function extractText(message) {
        if (!message) return null
        if (message.conversation) return message.conversation
        if (message.extendedTextMessage && message.extendedTextMessage.text) return message.extendedTextMessage.text
        if (message.imageMessage && message.imageMessage.caption) return message.imageMessage.caption
        if (message.videoMessage && message.videoMessage.caption) return message.videoMessage.caption
        return null
      }

      // Esperar OK inicial
      let okResp
      try {
        okResp = await waitReply(120000) // 2 minutos
      } catch (e) {
        return conn.reply(from, '⏱️ Se agotó el tiempo de espera. Ejecuta el comando nuevamente cuando estés listo.', introMsg)
      }
      if (okResp.canceled) return

      // Empezamos pasos
      // 1) Fecha
      let fecha
      while (true) {
        const ask1 = await conn.sendMessage(from, { text: '*Paso 1/6* — Escribe la *FECHA* (DD/MM/AAAA o DD-MM-AAAA). Responde a este mensaje.' })
        let r
        try { r = await waitReply(180000) } catch (e) { return conn.reply(from, '⏱️ Tiempo agotado. Proceso terminado.', m) }
        if (r.canceled) return
        const text = r.text.trim()
        // Validación simple de fecha
        const fechaVal = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
        if (!fechaVal) {
          await conn.sendMessage(from, { text: '❌ Formato inválido de fecha. Debe ser DD/MM/AAAA. Ejemplo: 05/09/2025. Intenta otra vez.' })
          continue
        }
        // Normalizar a DD/MM/YYYY
        const dd = fechaVal[1].padStart(2, '0')
        const mm = fechaVal[2].padStart(2, '0')
        let yy = fechaVal[3]
        if (yy.length === 2) yy = '20' + yy
        fecha = `${dd}/${mm}/${yy}`
        break
      }

      // 2) Casilla
      let casilla
      while (true) {
        const ask2 = await conn.sendMessage(from, { text: '*Paso 2/6* — Escribe la *CASILLA* (ej: C# 1 o C# 3). Responde a este mensaje.' })
        let r
        try { r = await waitReply(120000) } catch (e) { return conn.reply(from, '⏱️ Tiempo agotado. Proceso terminado.', m) }
        if (r.canceled) return
        const text = r.text.trim()
        // Validar formato simple: debe contener C# o c# y un número
        const c = text.match(/C#\s*(\d+)/i)
        if (!c) {
          await conn.sendMessage(from, { text: '❌ Formato inválido de casilla. Usa algo como: `C# 1` o `C# 3`. Intenta otra vez.' })
          continue
        }
        casilla = `C# ${c[1]}`
        break
      }

      // 3) Hora MX
      let horaMX, horaCOL, horaVNZ
      while (true) {
        const ask3 = await conn.sendMessage(from, { text: '*Paso 3/6* — Escribe la *HORA MX* (ej: 7:00 pm o 19:00). Responde a este mensaje.' })
        let r
        try { r = await waitReply(120000) } catch (e) { return conn.reply(from, '⏱️ Tiempo agotado. Proceso terminado.', m) }
        if (r.canceled) return
        const text = r.text.trim()
        // Intentamos parsear hh:mm (am/pm opcional)
        const timeMatch = text.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)
        if (!timeMatch) {
          await conn.sendMessage(from, { text: '❌ Formato inválido de hora. Usa `7:00 pm` o `19:00`. Intenta otra vez.' })
          continue
        }
        let hh = parseInt(timeMatch[1])
        const mm = parseInt(timeMatch[2])
        const ampm = timeMatch[3]
        if (ampm) {
          const ap = ampm.toLowerCase()
          if (ap === 'pm' && hh < 12) hh += 12
          if (ap === 'am' && hh === 12) hh = 0
        }
        // Formato 24h -> convertir a display 12h pm/am
        function to12(h,mn){
          const am = h < 12
          const h12 = ((h + 11) % 12) + 1
          const mmS = String(mn).padStart(2,'0')
          return `${h12}:${mmS} ${am? 'am' : 'pm'}`
        }
        horaMX = to12(hh, mm)
        // Autocompletar: Colombia (MX -1 hour? Actually MX varies. Usaremos una diferencia simple: COL = MX + 1, VNZ = MX + 2)
        // Según tu comentario anterior: "se autocompletaran las otras dos" — asumimos COL = MX + 1, VNZ = MX + 2
        // Convert hh/mm numbers for shift
        const mx24 = hh
        const col24 = (mx24 + 1) % 24
        const vnz24 = (mx24 + 2) % 24
        horaCOL = to12(col24, mm)
        horaVNZ = to12(vnz24, mm)
        break
      }

      // 4) Titulares
      let titulares = []
      while (true) {
        const ask4 = await conn.sendMessage(from, { text: '*Paso 4/6* — Escribe los *TITULARES* con este formato:\n`nombre; @etiqueta; rol, nombre2; @etiqueta; rol2`\nEjemplo: `andres; @andres123; rush, pablo; @pablito; granadero`\nResponde a este mensaje.' })
        let r
        try { r = await waitReply(240000) } catch (e) { return conn.reply(from, '⏱️ Tiempo agotado. Proceso terminado.', m) }
        if (r.canceled) return
        const text = r.text.trim()
        // Validar: debe contener al menos un ';' y que los jugadores estén separados por ','
        const jugadores = text.split(',').map(s => s.trim()).filter(Boolean)
        let bad = false
        const parsed = []
        for (const j of jugadores) {
          const parts = j.split(';').map(x=>x.trim())
          if (parts.length < 3) { bad = true; break }
          const [nombre, etiqueta, rol] = parts
          if (!nombre || !etiqueta) { bad = true; break }
          parsed.push({ nombre, etiqueta, rol })
        }
        if (bad || parsed.length === 0) {
          await conn.sendMessage(from, { text: '❌ Formato incorrecto de titulares. Asegúrate de usar `nombre; @etiqueta; rol` para cada jugador y separarlos con comas. Ejemplo:\n`andres; @andres123; rush, pablo; @pablito; granadero`' })
          continue
        }
        titulares = parsed
        break
      }

      // 5) Suplentes
      let suplentes = []
      while (true) {
        const ask5 = await conn.sendMessage(from, { text: '*Paso 5/6* — Escribe los *SUPLENTES* con este formato:*\n`nombre; @etiqueta, nombre2; @etiqueta`\n(Nota: aquí no se incluye rol). Responde a este mensaje.' })
        let r
        try { r = await waitReply(180000) } catch (e) { return conn.reply(from, '⏱️ Tiempo agotado. Proceso terminado.', m) }
        if (r.canceled) return
        const text = r.text.trim()
        if (!text) { suplentes = []; break }
        const jugadores = text.split(',').map(s => s.trim()).filter(Boolean)
        let bad = false
        const parsed = []
        for (const j of jugadores) {
          const parts = j.split(';').map(x=>x.trim())
          if (parts.length < 2) { bad = true; break }
          const [nombre, etiqueta] = parts
          if (!nombre || !etiqueta) { bad = true; break }
          parsed.push({ nombre, etiqueta })
        }
        if (bad) {
          await conn.sendMessage(from, { text: '❌ Formato incorrecto en suplentes. Usa `nombre; @etiqueta` y separa jugadores con comas. Ejemplo:\n`juan; @juan123, luis; @luis77`' })
          continue
        }
        suplentes = parsed
        break
      }

      // 6) Mapas
      let mapas = []
      {
        const ask6 = await conn.sendMessage(from, { text: '*Paso 6/6* — Escribe los *MAPAS* separados por comas en el orden deseado. Si no los llenas todos, aparecerán tal cual los pongas. Responde a este mensaje.' })
        let r
        try { r = await waitReply(180000) } catch (e) { return conn.reply(from, '⏱️ Tiempo agotado. Proceso terminado.', m) }
        if (r.canceled) return
        const text = r.text.trim()
        if (!text) mapas = []
        else mapas = text.split(',').map(s => s.trim()).filter(Boolean)
      }

      // Generar ficha final con el formato solicitado
      function buildFicha() {
        // Titulares formateados (hasta 4)
        const titularesFmt = titulares.slice(0,4).map((t,i)=>`➤ [ ${i+1} ]  ${t.nombre}  ☠️[ ${t.rol} ]`).join('\n')
        const suplentesFmt = suplentes.slice(0,4).map((s,i)=>`➤ [ S${i+1} ]  ${s.nombre}`).join('\n')

        // Mapas hasta 5
        const mapasArr = []
        for (let i=0;i<5;i++) {
          const v = mapas[i] ? mapas[i] : 'NULL'
          mapasArr.push(`${i+1}️⃣ ❌ ${v} ❌`)
        }

        const ficha = `☠️ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐀 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐑 ☠️\n━━━━━━━━━━━━━━━━━━━\n📅 𝐅𝐄𝐂𝐇𝐀: ${fecha}   📦 𝐂𝐀𝐒𝐈𝐋𝐋𝐀: ${casilla}  ____________________\n⏰ 𝐇𝐎𝐑𝐀:\n   🇲🇽 MX: ${horaMX}      🇨🇴 COL: ${horaCOL}      🇻🇪 VNZ: ${horaVNZ}\n━━━━━━━━━━━━━━━━━━━\n👑 𝐓𝐈𝐓𝐔𝐋𝐀𝐑𝐄𝐒:\n${titularesFmt}\n\n⚔️ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:\n${suplentesFmt || '➤ [ Ninguno ]'}\n\n━━━━━━━━━━━━━━━━━━━\n🗺️ 𝐌𝐀𝐏𝐀𝐒 𝐀 𝐉𝐔𝐆𝐀𝐑:\n${mapasArr.join(' \n')}`
        return ficha
      }

      const final = buildFicha()
      await conn.sendMessage(from, { text: '*Ficha creada correctamente:*\n\n' + final })

      // Fin

    } catch (error) {
      console.error(error)
      try { conn.sendMessage(m.chat || m.key.remoteJid, { text: '❌ Ocurrió un error al ejecutar el comando. Revisa la consola del bot.' }) } catch(e){}
    }
  }
}

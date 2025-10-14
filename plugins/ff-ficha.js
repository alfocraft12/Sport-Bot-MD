import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Datos temporales del flujo
    let data = {
      fecha: '',
      casilla: '',
      horaMX: '',
      titularesRaw: '', // texto crudo recibido
      suplentesRaw: '',
      mapasRaw: ''
    }
    let mentions = [] // acumulador de menciones (ids whatsapp)

    // Función que envía un mensaje y espera una respuesta *reply* a ese mensaje
    const ask = async (msg) => {
      const sent = await conn.reply(m.chat, msg, m)
      return new Promise((resolve, reject) => {
        const listener = async ({ messages }) => {
          try {
            for (const ms of messages) {
              if (!ms.message) continue
              if (ms.key.remoteJid !== m.chat) continue
              // Asegurarnos que sea reply al mensaje enviado (stanzaId igual al id del mensaje que enviamos)
              const ctx = ms.message.extendedTextMessage && ms.message.extendedTextMessage.contextInfo
              if (!ctx || !ctx.stanzaId) continue
              if (ctx.stanzaId !== sent.key.id) continue
              conn.ev.off('messages.upsert', listener)
              return resolve(ms)
            }
          } catch (e) {
            // ignore
          }
        }
        conn.ev.on('messages.upsert', listener)
        // timeout por seguridad (5 min)
        setTimeout(() => {
          conn.ev.off('messages.upsert', listener)
          reject(new Error('timeout'))
        }, 5 * 60 * 1000)
      })
    }

    // Mensaje inicial explicativo
    await conn.reply(m.chat, `🧩 *Creación de ficha demo iniciada* 🧩

Responde *SIEMPRE* al mensaje del bot (usar la función \"responder\") para que el sistema detecte el paso.
Si te equivocas, escribe *cancel* en la respuesta para cancelar el proceso.

*Pasos:*
1) Fecha (DD/MM/AAAA)
2) Casilla (número)
3) Hora MX (ej: 7:00 pm)
4) Titulares (formato obligatorio: nombre; @etiqueta; rol, nombre; @etiqueta; rol -> exactamente 4 titulares)
5) Suplentes (opcional: nombre; @etiqueta, nombre; @etiqueta)
6) Mapas (separados por comas)

Ejemplo titulares:
andres; @584123456789; rush, pablo; @57314...; granadero

👉 Responde OK cuando estés listo.`, m)

    // esperar OK (reply al mensaje)
    try {
      const ok = await ask('Responde *OK* para empezar o *cancel* para cancelar.')
      const okTxt = (ok.message.conversation || ok.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(okTxt)) return conn.reply(m.chat, '❌ Proceso cancelado.', m)
    } catch (e) {
      return conn.reply(m.chat, '⏱️ Tiempo agotado esperando confirmación. Ejecuta el comando de nuevo.', m)
    }

    // ---------- Paso 1: Fecha ----------
    while (!data.fecha) {
      let res
      try {
        res = await ask('📅 *Paso 1/6* — Escribe la *FECHA* (DD/MM/AAAA). Ej: 05/09/2025')
      } catch (e) {
        return conn.reply(m.chat, '⏱️ Tiempo agotado. Proceso terminado.', m)
      }
      const txt = (res.message.conversation || res.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
      const fechaVal = txt.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
      if (!fechaVal) {
        await conn.reply(m.chat, '❗ Formato inválido de fecha. Usa DD/MM/AAAA. Ej: 05/09/2025', m)
        continue
      }
      // normalizar
      const dd = fechaVal[1].padStart(2, '0')
      const mm = fechaVal[2].padStart(2, '0')
      let yy = fechaVal[3]
      if (yy.length === 2) yy = '20' + yy
      data.fecha = `${dd}/${mm}/${yy}`
    }

    // ---------- Paso 2: Casilla ----------
    while (!data.casilla) {
      let res
      try {
        res = await ask('📦 *Paso 2/6* — Escribe la *CASILLA* (número). Ej: 3')
      } catch (e) {
        return conn.reply(m.chat, '⏱️ Tiempo agotado. Proceso terminado.', m)
      }
      const txt = (res.message.conversation || res.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
      if (!/^\d+$/.test(txt)) {
        await conn.reply(m.chat, '❗ Casilla inválida. Escribe solo un número (ej: 1, 2, 3).', m)
        continue
      }
      data.casilla = txt
    }

    // ---------- Paso 3: Hora MX ----------
    const parseTimeTo24h = (txt) => {
      const t = txt.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)
      if (!t) return null
      let hh = parseInt(t[1])
      const mm = parseInt(t[2])
      const ampm = t[3]?.toLowerCase()
      if (ampm) {
        if (ampm === 'pm' && hh < 12) hh += 12
        if (ampm === 'am' && hh === 12) hh = 0
      }
      return { hh, mm }
    }
    const to12 = (h, mn) => {
      const am = h < 12
      const h12 = ((h + 11) % 12) + 1
      const mmS = String(mn).padStart(2, '0')
      return `${h12}:${mmS} ${am ? 'am' : 'pm'}`
    }

    while (!data.horaMX) {
      let res
      try {
        res = await ask('⏰ *Paso 3/6* — Escribe la *HORA MX* (formato 12h). Ej: 7:00 pm')
      } catch (e) {
        return conn.reply(m.chat, '⏱️ Tiempo agotado. Proceso terminado.', m)
      }
      const txt = (res.message.conversation || res.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
      const parsed = parseTimeTo24h(txt)
      if (!parsed) {
        await conn.reply(m.chat, '❗ Formato inválido. Usa algo como: 7:30 pm o 19:00', m)
        continue
      }
      data.horaMX = to12(parsed.hh, parsed.mm)
      // autocalculo
      const col24 = (parsed.hh + 1) % 24
      const vnz24 = (parsed.hh + 2) % 24
      data.horaCOL = to12(col24, parsed.mm)
      data.horaVNZ = to12(vnz24, parsed.mm)
    }

    // ---------- Paso 4: Titulares (OBLIGATORIO: EXACTAMENTE 4 con nombre; @etiqueta; rol) ----------
    let titularesParsed = null
    while (!titularesParsed) {
      let res
      try {
        res = await ask(`👑 *Paso 4/6* — Ingresa los *TITULARES* (exactamente 4). Formato obligatorio:\n\nnombre; @etiqueta; rol, nombre2; @etiqueta2; rol2, ...\n\nEjemplo:\nandres; @584123456789; rush, pablo; @57314...; granadero, carlos; @57...; igl, juan; @57...; lurker`)
      } catch (e) {
        return conn.reply(m.chat, '⏱️ Tiempo agotado. Proceso terminado.', m)
      }
      const txt = (res.message.conversation || res.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)

      // Split jugadores por coma principal
      const jugadores = txt.split(',').map(s => s.trim()).filter(Boolean)
      if (jugadores.length !== 4) {
        await conn.reply(m.chat, '❗ Debes ingresar *exactamente 4* titulares. Revisa el formato y vuelve a intentarlo.', m)
        continue
      }

      // Parsear cada jugador: nombre; @etiqueta; rol
      let bad = false
      const parsedTit = []
      const localMentions = []
      for (const j of jugadores) {
        const parts = j.split(';').map(p => p.trim()).filter(Boolean)
        if (parts.length < 3) { bad = true; break }
        const nombre = parts[0]
        const etiquetaRaw = parts[1] // puede venir con @ o sin
        const rol = parts.slice(2).join(';') // por si el rol contiene ';' (lo unimos)
        if (!nombre || !etiquetaRaw || !rol) { bad = true; break }
        // Extraer dígitos de la etiqueta para formar id
        const digits = etiquetaRaw.replace(/\D/g, '')
        if (!digits || digits.length < 6) { bad = true; break }
        const jid = digits + '@s.whatsapp.net'
        localMentions.push(jid)
        parsedTit.push({ nombre, etiquetaRaw, rol, jid, digits })
      }
      if (bad) {
        await conn.reply(m.chat, '❗ Formato incorrecto en titulares. Usa: nombre; @numero; rol (y separa jugadores con coma). Ejemplo:\nandres; @584123456789; rush, pablo; @57314...; granadero ...', m)
        continue
      }

      // all good
      titularesParsed = parsedTit
      // agregar a menciones globales
      mentions = [...new Set([...mentions, ...localMentions])]
      data.titularesRaw = titularesParsed
    }

    // ---------- Paso 5: Suplentes (OPCIONAL: formato nombre; @etiqueta, ...) ----------
    let suplentesParsed = []
    while (data.suplentesRaw === '') {
      let res
      try {
        res = await ask(`⚔️ *Paso 5/6* — Ingresa los *SUPLENTES* (opcional). Formato:\n\nnombre; @etiqueta, nombre2; @etiqueta2\n\nSi no quieres agregar suplentes responde: NONE`)
      } catch (e) {
        return conn.reply(m.chat, '⏱️ Tiempo agotado. Proceso terminado.', m)
      }
      const txt = (res.message.conversation || res.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
      if (/^none$/i.test(txt) || txt.length === 0) {
        data.suplentesRaw = ''
        suplentesParsed = []
        break
      }
      const jugadores = txt.split(',').map(s => s.trim()).filter(Boolean)
      let bad = false
      const parsedSup = []
      const localMentions = []
      for (const j of jugadores) {
        const parts = j.split(';').map(p => p.trim()).filter(Boolean)
        if (parts.length < 2) { bad = true; break }
        const nombre = parts[0]
        const etiquetaRaw = parts[1]
        const digits = etiquetaRaw.replace(/\D/g, '')
        if (!digits || digits.length < 6) { bad = true; break }
        const jid = digits + '@s.whatsapp.net'
        localMentions.push(jid)
        parsedSup.push({ nombre, etiquetaRaw, jid, digits })
      }
      if (bad) {
        await conn.reply(m.chat, '❗ Formato inválido en suplentes. Usa: nombre; @numero (separa con comas) o responde NONE para omitir.', m)
        continue
      }
      suplentesParsed = parsedSup
      mentions = [...new Set([...mentions, ...localMentions])]
      data.suplentesRaw = suplentesParsed
    }

    // ---------- Paso 6: Mapas ----------
    while (!data.mapasRaw) {
      let res
      try {
        res = await ask(`🗺️ *Paso 6/6* — Ingresa los *MAPAS* separados por comas (en orden). Ej: Bermuda, Kalahari, Alpine`)
      } catch (e) {
        return conn.reply(m.chat, '⏱️ Tiempo agotado. Proceso terminado.', m)
      }
      const txt = (res.message.conversation || res.message.extendedTextMessage?.text || '').trim()
      if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
      if (!txt) {
        await conn.reply(m.chat, '❗ Debes ingresar al menos un mapa o escribir NONE para omitir.', m)
        continue
      }
      data.mapasRaw = txt
    }

    // ---------- Procesar mapas ----------
    let mapasArr = data.mapasRaw.split(',').map(s => s.trim()).filter(Boolean)
    while (mapasArr.length < 5) mapasArr.push('❌ NULL ❌')

    // ---------- Construir ficha final ----------
    // Titulares: formatear sin mostrar ';' y mostrando rol aparte y menciones reales
    const titularesFmt = data.titularesRaw.map((t, i) => {
      // mostrar: ➤ [ i ] Nombre  ☠️[ rol ]  @digits
      return `➤ [ ${i + 1} ] ${t.nombre}  ☠️[ ${t.rol} ]  @${t.digits}`
    }).join('\n')

    const suplentesFmt = (data.suplentesRaw && data.suplentesRaw.length)
      ? data.suplentesRaw.map((s, i) => `➤ [ S${i + 1} ] ${s.nombre}  @${s.digits}`).join('\n')
      : '➤ [ Ninguno ]'

    const ficha = `☠️ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐀 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐑 ☠️
━━━━━━━━━━━━━━━━━━━
📅 𝐅𝐄𝐂𝐇𝐀: ${data.fecha}   📦 𝐂𝐀𝐒𝐈𝐋𝐋𝐀: C# ${data.casilla}  ____________________
⏰ 𝐇𝐎𝐑𝐀:
     🇲🇽 MX: ${data.horaMX}      🇨🇴 COL: ${data.horaCOL}      🇻🇪 VNZ: ${data.horaVNZ}
━━━━━━━━━━━━━━━━━━━
👑 𝐓𝐈𝐓𝐔𝐋𝐀𝐑𝐄𝐒:
${titularesFmt}

⚔️ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
${suplentesFmt}
━━━━━━━━━━━━━━━━━━━
🗺️ 𝐌𝐀𝐏𝐀𝐒 𝐀 𝐉𝐔𝐆𝐀𝐑:
1️⃣ ${mapasArr[0]}
2️⃣ ${mapasArr[1]}
3️⃣ ${mapasArr[2]}
4️⃣ ${mapasArr[3]}
5️⃣ ${mapasArr[4]}`

    // Enviar la ficha con menciones reales (si hay)
    const sendPayload = { text: ficha }
    if (mentions.length) sendPayload.mentions = mentions

    await conn.sendMessage(m.chat, sendPayload, { quoted: m })

  } catch (err) {
    console.error(err)
    try { await conn.reply(m.chat, '❌ Ocurrió un error durante el proceso. Revisa la consola del bot.', m) } catch(e){}
  }
}

handler.help = ['demo2']
handler.tags = ['owner']
handler.command = ['demo2']
handler.owner = false

export default handler

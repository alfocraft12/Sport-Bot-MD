import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  let step = 0
  let data = {
    fecha: '',
    casilla: '',
    horaMX: '',
    titulares: '',
    suplentes: '',
    mapas: ''
  }

  const ask = async (msg) => {
    const sent = await conn.reply(m.chat, msg, m)
    return new Promise((resolve) => {
      const listener = async ({ messages }) => {
        for (const ms of messages) {
          if (!ms.message) continue
          if (ms.key.remoteJid !== m.chat) continue
          if (!ms.message.extendedTextMessage || !ms.message.extendedTextMessage.contextInfo?.stanzaId) continue
          if (ms.message.extendedTextMessage.contextInfo.stanzaId !== sent.key.id) continue
          conn.ev.off('messages.upsert', listener)
          resolve(ms)
        }
      }
      conn.ev.on('messages.upsert', listener)
    })
  }

  await conn.reply(m.chat, `🧩 *Creación de ficha demo iniciada* 🧩\n\nResponder cada mensaje del bot con la información que se pide.\nSi te equivocas, el bot te volverá a pedir el dato.\n\n👉 Para cancelar escribe *cancel* en cualquier paso.`, m)

  // Paso 1: Fecha
  while (!data.fecha) {
    let res = await ask('📅 Ingresa la *fecha* en formato (día/mes/año):\n\nEjemplo: 14/10/2025')
    let txt = res.message.extendedTextMessage?.text || ''
    if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(txt)) {
      await conn.reply(m.chat, '❗ Formato inválido. Usa el formato correcto (día/mes/año).', m)
      continue
    }
    data.fecha = txt
  }

  // Paso 2: Casilla
  while (!data.casilla) {
    let res = await ask('📦 Ingresa el número de *casilla*:\n\nEjemplo: 4')
    let txt = res.message.extendedTextMessage?.text || ''
    if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
    if (!/^\d+$/.test(txt)) {
      await conn.reply(m.chat, '❗ Solo números válidos.', m)
      continue
    }
    data.casilla = txt
  }

  // Paso 3: Hora MX (las demás se autogeneran)
  while (!data.horaMX) {
    let res = await ask('⏰ Ingresa la *hora de México* en formato 12h (ejemplo: 7:00 pm):')
    let txt = res.message.extendedTextMessage?.text || ''
    if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
    if (!/^\d{1,2}:\d{2}\s?(am|pm)$/i.test(txt)) {
      await conn.reply(m.chat, '❗ Usa el formato 12h, ejemplo: 7:30 pm', m)
      continue
    }
    data.horaMX = txt
  }

  // Paso 4: Titulares
  while (!data.titulares) {
    let res = await ask(`👑 Ingresa los *titulares* con el formato:\n\n> nombre; @etiqueta; rol, nombre; @etiqueta; rol\n\nEjemplo:\nAndres; @etiqueta; Rush, Pablo; @etiqueta; Granadero`)
    let txt = res.message.extendedTextMessage?.text || ''
    if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
    if (!txt.includes(';') || !txt.includes(',')) {
      await conn.reply(m.chat, '❗ Formato inválido. Usa el ejemplo del mensaje anterior.', m)
      continue
    }
    data.titulares = txt
  }

  // Paso 5: Suplentes
  while (!data.suplentes) {
    let res = await ask(`⚔️ Ingresa los *suplentes* en el formato:\n\n> nombre; @etiqueta, nombre; @etiqueta\n\nEjemplo:\nJose; @etiqueta, Luis; @etiqueta`)
    let txt = res.message.extendedTextMessage?.text || ''
    if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
    if (!txt.includes(';')) {
      await conn.reply(m.chat, '❗ Formato inválido. Usa el ejemplo del mensaje anterior.', m)
      continue
    }
    data.suplentes = txt
  }

  // Paso 6: Mapas
  while (!data.mapas) {
    let res = await ask(`🗺️ Ingresa los *mapas a jugar* separados por comas (,)\n\nEjemplo:\nBermuda, Kalahari, Alpine, Purgatorio, Nurek`)
    let txt = res.message.extendedTextMessage?.text || ''
    if (/^cancel$/i.test(txt)) return conn.reply(m.chat, '❌ Operación cancelada.', m)
    data.mapas = txt
  }

  // Procesar mapas
  let mapasArr = data.mapas.split(',').map(x => x.trim())
  while (mapasArr.length < 5) mapasArr.push('❌ NULL ❌')

  // Generar ficha final
  let ficha = `☠️ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐀 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐑 ☠️
━━━━━━━━━━━━━━━━━━━
📅 𝐅𝐄𝐂𝐇𝐀: ${data.fecha}
📦 𝐂𝐀𝐒𝐈𝐋𝐋𝐀: C# ${data.casilla}
____________________
⏰ 𝐇𝐎𝐑𝐀:
     🇲🇽 MX: ${data.horaMX}
     🇨🇴 COL: ${data.horaMX.replace(/\d+/, (n)=>parseInt(n)+1)}
     🇻🇪 VNZ: ${data.horaMX.replace(/\d+/, (n)=>parseInt(n)+2)}
━━━━━━━━━━━━━━━━━━━
👑 𝐓𝐈𝐓𝐔𝐋𝐀𝐑𝐄𝐒:
➤ [ 1 ] ${data.titulares.split(',')[0] || ''}
➤ [ 2 ] ${data.titulares.split(',')[1] || ''}
➤ [ 3 ] ${data.titulares.split(',')[2] || ''}
➤ [ 4 ] ${data.titulares.split(',')[3] || ''}

⚔️ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
➤ [ S1 ] ${data.suplentes.split(',')[0] || ''}
➤ [ S2 ] ${data.suplentes.split(',')[1] || ''}
━━━━━━━━━━━━━━━━━━━
🗺️ 𝐌𝐀𝐏𝐀𝐒 𝐀 𝐉𝐔𝐆𝐀𝐑:
1️⃣ ${mapasArr[0]}
2️⃣ ${mapasArr[1]}
3️⃣ ${mapasArr[2]}
4️⃣ ${mapasArr[3]}
5️⃣ ${mapasArr[4]}`

  await conn.reply(m.chat, ficha, m)
}

handler.help = ['demo2']
handler.tags = ['owner']
handler.command = ['demo2']
handler.owner = false

export default handler

import fetch from 'node-fetch'

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `Ꙭ *Ingresa una petición*\n\nEjemplo: ${usedPrefix + command} ¿Qué opinas de Alfo?`, m, rcanal)
  }

  try {
    await m.react('🕒')
    conn.sendPresenceUpdate('composing', m.chat)

    const url = `https://vihangayt.me/tools/chatgpt?q=${encodeURIComponent(text)}`
    const res = await fetch(url)

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const raw = await res.text()
      console.error('❌ Respuesta no JSON:', raw.slice(0, 100))
      throw new Error('La API devolvió una respuesta no válida.')
    }

    const json = await res.json()

    if (!json.data) {
      throw new Error('❌ No se recibió respuesta desde la API.')
    }

    await conn.reply(m.chat, json.data.trim(), m, rcanal)
    await m.react('✅')

  } catch (err) {
    await m.react('✖️')
    console.error(err)
    return conn.reply(m.chat, '☢️ *Ocurrió un fallo al consultar la IA.*', m, rcanal)
  }
}

handler.command = ['bard']
handler.help = ['bard']
handler.tags = ['ai']
handler.group = true
handler.register = false
handler.premium = false

export default handler

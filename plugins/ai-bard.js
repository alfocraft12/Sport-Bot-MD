import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Ꙭ *Ingresa una petición*\n\nEjemplo: ${usedPrefix + command} Conoces a DcA Barbie?`, m, rcanal)

  try {
    await m.react('🕒')
    conn.sendPresenceUpdate('composing', m.chat)

    const response = await fetch(`https://api.akuari.my.id/ai/bard?chat=${encodeURIComponent(text)}`)
    const json = await response.json()

    if (!json || !json.respon) throw new Error('❌ No se recibió respuesta válida.')

    await conn.reply(m.chat, json.respon, m, rcanal)
    await m.react('✅️')

  } catch (error) {
    await m.react('✖️')
    console.error(error)
    return conn.reply(m.chat, '☢︎︎ *Ocurrió un fallo al procesar tu mensaje.*', m, rcanal)
  }
}

handler.command = ['bard']
handler.help = ['bard']
handler.group = true
handler.register = false
handler.tags = ['ai']
handler.premium = false
export default handler

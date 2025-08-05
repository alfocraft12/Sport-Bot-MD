// plugins/sticker-brat.js
import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let text

  if (args.length >= 1) {
    text = args.join(' ')
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text
  } else {
    return conn.reply(m.chat, `✳️ Usa el comando así:\n${usedPrefix + command} no me hables >:c`, m)
  }

  if (text.length > 60) return conn.reply(m.chat, '💬 El texto no puede tener más de 60 caracteres.', m)

  // Generar imagen tipo brat con API personalizada (aquí usamos un fondo rosa básico)
  const apiURL = `https://api.popcat.xyz/sticker?text=${encodeURIComponent(text)}&color=ffc0cb&background=1`

  try {
    const response = await axios.get(apiURL, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)

    const stiker = await sticker(buffer, false, global.packname, global.author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'brat.webp', '', m)
    else throw '⚠️ No se pudo generar el sticker.'
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Ocurrió un error al generar el sticker.', m)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = ['brat']
handler.register = false
export default handler

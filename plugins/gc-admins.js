import { promises as fs } from 'fs'
import path from 'path'

var handler = async (m, { conn, participants }) => {
  // Filtrar solo administradores (normales y superadmins)
  const admins = participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id)

  const mensaje = `👮‍♂️ *Mención a los admins del grupo:*\n\n${admins.map(a => `@${a.split('@')[0]}`).join('\n')}`

  // Leer imagen desde la carpeta src
  const imgPath = path.join('./src', 'admins.jpg')
  const buffer = await fs.readFile(imgPath)

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: mensaje,
    mentions: admins
  }, { quoted: m })
}

handler.help = ['admins']
handler.tags = ['grupo']
handler.command = ['admins', 'mencionaradmins']

handler.group = true

export default handler


import { promises as fs } from 'fs'
import path from 'path'

var handler = async (m, { conn, participants }) => {
  // Filtrar administradores (admin y superadmin)
  const admins = participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id)

  const mensaje = `👮‍♂️ *Admins del grupo:*\n\n${admins.map(a => `- 😎 @${a.split('@')[0]}`).join('\n')}`

  // Ruta de la imagen
  const imgPath = path.join('./src', 'admins.jpeg')
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

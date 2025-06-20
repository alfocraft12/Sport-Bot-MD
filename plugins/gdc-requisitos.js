var handler = async (m, { conn, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id))

  const mensaje = `
📌 *REGLAS DEL GRUPO*
1. No spam
2. Respeto entre todos
3. Prohibido contenido +18
4. No hacer flood
5. Cumple y sé parte del grupo 👍

— _El admin_
  `.trim()

  // Caracter invisible para que las menciones queden ocultas
  const invisible = String.fromCharCode(8206).repeat(850)

  await conn.relayMessage(
    m.chat,
    {
      extendedTextMessage: {
        text: `${invisible}\n${mensaje}`,
        contextInfo: {
          mentionedJid: users
        }
      }
    },
    {}
  )
}

handler.help = ['requisitos']
handler.tags = ['grupo']
handler.command = ['requisitos', 'gdc', 'guerra de clanes'] // Puedes cambiar los nombres

handler.group = true
handler.admin = true

export default handler

var handler = async (m, { conn, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id))

  const mensaje = `
📌 *Requisitos para permanecer en el clan*
1. Prueba de comando (anexo)

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

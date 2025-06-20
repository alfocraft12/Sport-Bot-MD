var handler = async (m, { conn, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id))

  const mensaje = `
📌 *REGLAS DEL GRUPO*
1. Prueba.js

— _El admin_
  `.trim()

  const fakeMsg = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: m.chat
    },
    message: {
      conversation: mensaje
    }
  }

  const msg = conn.cMod(
    m.chat,
    generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: mensaje,
        contextInfo: {
          mentionedJid: users
        }
      }
    }, { quoted: null, userJid: conn.user.id }),
    mensaje,
    conn.user.jid,
    { mentions: users }
  )

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['requisitos']
handler.tags = ['grupo']
handler.command = ['requisitos', 'gdc', 'guerra de clanes'] // Puedes cambiar los nombres

handler.group = true
handler.admin = true

export default handler

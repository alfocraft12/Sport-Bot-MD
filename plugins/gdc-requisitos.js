var handler = async (m, { conn }) => {
  const mensaje = `
📌 *REGLAS DEL GRUPO*
1. No spam
2. Respeto entre todos
3. Prohibido contenido +18
4. No hacer flood
5. Cumple y sé parte del grupo 👍

— _El admin_
  `.trim()

  await conn.relayMessage(
    m.chat,
    {
      extendedTextMessage: {
        text: mensaje
      }
    },
    {}
  )
}

handler.help = ['requisitos']
handler.tags = ['grupo']
handler.command = ['requisitos', 'gdc', 'guerra de clanes']

handler.group = true
handler.admin = true

export default handler


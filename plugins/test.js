let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { text: '🧪 Test de envío directo, me vez????' })
}
handler.command = ['tester']
export default handler

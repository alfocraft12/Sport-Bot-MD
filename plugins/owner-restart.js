import { spawn } from 'child_process'
var handler = async (m, { conn, isROwner, text }) => {
if (conn.user.jid == conn.user.jid) {
await conn.reply(m.chat, '*🔄 EL BOT SE ESTA REINICIANDO ~ALFO~ 🔄*', m, rcanal)
// Usar el reloadHandler en lugar de process.send
await global.reloadHandler(true).catch(console.error)
await conn.reply(m.chat, '*✅ BOT REINICIADO CORRECTAMENTE*', m, rcanal)
} else throw 'eh'
}
handler.help = ['restart']
handler.tags = ['owner']
handler.command = ['restart','reiniciar'] 
handler.rowner = true
export default handler

let handler = async (m, { conn, usedPrefix, command }) => {

  let fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  let yaemori = `let handler = async (m, { conn }) => {
  let imagen = './src/freefire/bermuda.jpeg'
}

${global.md}`.trim()

  await delay(1000) // <-- para prevenir el rate-overlimit
  await conn.reply(m.chat, yaemori, m, fkontak)
}

handler.help = ['mapas']
handler.tags = ['main']
handler.command = ['bermuda']
handler.register = false
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

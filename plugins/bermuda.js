let handler = async (m, { conn }) => {
  let fake = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Sport Bot;;;\nFN:Sport Bot\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  let imagen = './src/freefire/bermuda.jpeg'
  await conn.sendFile(m.chat, imagen, 'bermuda.jpeg', '', null, false, fake)
}

handler.command = ['bermuda']
handler.group = true
export default handler

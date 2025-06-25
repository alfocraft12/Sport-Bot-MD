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
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }
  }

  const texto = `${global.md}`.trim()

  // Primero manda la imagen como si fuera reenviada
  await conn.sendFile(m.chat, './src/freefire/bermuda.jpeg', 'bermuda.jpeg', '', null, false, fake)

  // Luego manda el texto de promoción del canal con el mismo fake
  await conn.reply(m.chat, texto, m, fake)
}

handler.help = ['bermuda33']
handler.tags = ['mapas2']
handler.command = ['bermuda33']
handler.register = false
export default handler

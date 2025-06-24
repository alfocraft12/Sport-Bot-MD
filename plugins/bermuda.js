let handler = async (m, { conn }) => {
  const fake = {
    key: {
      remoteJid: "120363393102930979@newsletter", // ID de tu canal
      fromMe: false,
      id: m.id,
      participant: "0@s.whatsapp.net"
    },
    message: {
      extendedTextMessage: {
        text: "Sport Bot" // Nombre que se mostrará como reenviado
      }
    }
  }

  let imagen = './src/freefire/bermuda.jpeg'
  await conn.sendFile(m.chat, imagen, 'bermuda.jpeg', '', m, false, fake)
}

handler.command = ['bermuda']
handler.group = true
export default handler

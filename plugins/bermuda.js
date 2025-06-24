let handler = async (m, { conn }) => {
  let fake = {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "Sport-Bot Noticias",
      body: "🗺️ Mapa competitivo: Bermuda",
      mediaType: 1,
      previewType: 0,
      thumbnailUrl: null,
      renderLargerThumbnail: true,
      showAdAttribution: true,
      sourceUrl: "https://whatsapp.com/channel/0029Vb3yM0T2v1ItNDrGIY3v" // ⚠️ Reemplaza con el link real de tu canal
    }
  }

  let imagen = './src/freefire/bermuda.jpeg'

  await conn.sendFile(m.chat, imagen, 'bermuda.jpeg', '', m, false, fake)
}

handler.command = ['bermuda']
handler.group = true
export default handler

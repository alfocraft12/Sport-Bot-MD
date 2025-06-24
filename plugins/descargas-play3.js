import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, command }) => {
  if (!text.trim()) return m.reply('🎵 Ingresa el nombre del video a buscar.');

  const search = await yts(text);
  if (!search.videos.length) return m.reply('❌ No se encontraron resultados.');

  const video = search.videos[0];
  const url = video.url;

  const info = `🎶 *Título:* ${video.title}
🕒 *Duración:* ${video.timestamp}
👁️ *Vistas:* ${video.views.toLocaleString()}
📺 *Canal:* ${video.author.name}
🗓️ *Publicado:* ${video.ago}
🔗 *Enlace:* ${url}`;

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption: info
  }, { quoted: m });

  // 📥 MP3 con API funcional actual
  if (command === 'play3') {
    try {
      await m.reply('🎧 Descargando audio desde servidor alternativo...');

      const api = await fetch(`https://skizo.tech/api/yta?url=${url}`);
      const res = await api.json();

      if (!res || !res.result?.url) throw new Error('No se encontró el enlace de audio.');

      await conn.sendMessage(m.chat, {
        audio: { url: res.result.url },
        mimetype: 'audio/mpeg',
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: 'Sport-Bot',
            body: video.title,
            thumbnailUrl: video.thumbnail,
            mediaUrl: url,
            sourceUrl: url,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

    } catch (e) {
      console.error('ERROR MP3:', e);
      return m.reply(`❌ Error al descargar el audio.\n📄 ${e.message}`);
    }
  }

  // 📥 MP4 (play23 o ytmp42)
  if (command === 'play23' || command === 'ytmp42') {
    try {
      await m.reply('📽️ Descargando video desde servidor alternativo...');

      const api = await fetch(`https://skizo.tech/api/ytv?url=${url}`);
      const res = await api.json();

      if (!res || !res.result?.url) throw new Error('No se encontró el enlace de video.');

      await conn.sendMessage(m.chat, {
        video: { url: res.result.url },
        mimetype: 'video/mp4',
        fileName: `${video.title}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: 'Sport-Bot',
            body: video.title,
            thumbnailUrl: video.thumbnail,
            mediaUrl: url,
            sourceUrl: url,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

    } catch (e) {
      console.error('ERROR MP4:', e);
      return m.reply(`❌ Error al descargar el video.\n📄 ${e.message}`);
    }
  }
};

handler.command = ['play3', 'play23', 'ytmp42']
handler.help = ['play3 <nombre>', 'play23 <nombre>', 'ytmp42 <nombre>']
handler.tags = ['downloader']
handler.group = true

export default handler

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

  // AUDIO para comando play3
  if (command === 'play3') {
    try {
      await m.reply('🔊 Descargando audio, espera un momento...');
      const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?url=${url}`);
      const json = await res.json();
      if (!json.status || !json.result?.url) throw 'No se pudo descargar el audio.';

      await conn.sendMessage(m.chat, {
        audio: { url: json.result.url },
        mimetype: 'audio/mpeg'
      }, { quoted: m });
    } catch (e) {
      console.error('Error MP3:', e.message);
      return m.reply('⚠️ Error al descargar audio.');
    }
  }

  // VIDEO para play2 o ytmp42
  if (command === 'play2' || command === 'ytmp42') {
    try {
      await m.reply('📽️ Descargando video, espera un momento...');
      const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp4?url=${url}`);
      const json = await res.json();
      if (!json.status || !json.result?.url) throw 'No se pudo descargar el video.';

      await conn.sendMessage(m.chat, {
        video: { url: json.result.url },
        mimetype: 'video/mp4',
        fileName: `${video.title}.mp4`
      }, { quoted: m });
    } catch (e) {
      console.error('Error MP4:', e.message);
      return m.reply('⚠️ Error al descargar video.');
    }
  }
}

handler.command = ['play3', 'play23', 'ytmp42']
handler.help = ['play3 <nombre>', 'play2 <nombre>', 'ytmp42 <nombre>']
handler.tags = ['downloader']
handler.group = true

export default handler

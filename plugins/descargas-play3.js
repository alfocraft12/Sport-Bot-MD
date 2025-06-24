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

  if (command === 'play') {
    try {
      const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?url=${url}`);
      const json = await res.json();
      if (!json.status) throw 'No se pudo descargar el audio.';
      const audioUrl = json.result.url;

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg'
      }, { quoted: m });
    } catch (e) {
      return m.reply('⚠️ Error al descargar audio.');
    }
  } else if (command === 'ytmp4' || command === 'play2') {
    try {
      const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp4?url=${url}`);
      const json = await res.json();
      if (!json.status) throw 'No se pudo descargar el video.';
      const videoUrl = json.result.url;

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        fileName: `${video.title}.mp4`
      }, { quoted: m });
    } catch (e) {
      return m.reply('⚠️ Error al descargar video.');
    }
  }
};

handler.command = ['play3', 'ytmp42', 'play4'];
handler.tags = ['downloader'];
handler.help = ['play2 <nombre>', 'ytmp42 <nombre>'];
handler.group = true;

export default handler;

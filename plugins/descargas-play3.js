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

  // MP3 - comando play3
  if (command === 'play3') {
  try {
    await m.reply('🔊 Descargando audio desde Akuari API...');

    const res = await fetch(`https://api.akuari.my.id/downloader/youtube2?link=${encodeURIComponent(url)}`);
    const json = await res.json();
    const audioUrl = json.mp3?.url;

    if (!audioUrl) throw new Error('No se encontró el enlace de audio.');

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
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
    console.error('Error MP3:', e.message);
    return m.reply(`❌ Error al descargar el audio.\n📄 ${e.message}`);
  }
}


  // MP4 - comandos play23 o ytmp42
  if (command === 'play23' || command === 'ytmp42') {
    try {
      await m.reply('📽️ Descargando video desde Y2Mate...');
      const res = await fetch(`https://aemt.me/downloadmp4?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (!json || !json.result?.url) throw new Error('No se pudo obtener el video.');

      await conn.sendMessage(m.chat, {
        video: { url: json.result.url },
        mimetype: 'video/mp4',
        fileName: `${video.title}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: "Sport-Bot",
            body: video.title,
            thumbnailUrl: video.thumbnail,
            mediaUrl: url,
            sourceUrl: url,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } catch (e) {
      console.error('Error MP4:', e.message);
      return m.reply(`❌ Error al descargar el video.`);
    }
  }
}

handler.command = ['play3', 'play23', 'ytmp42']
handler.help = ['play3 <nombre>', 'play23 <nombre>', 'ytmp42 <nombre>']
handler.tags = ['downloader']
handler.group = true

export default handler


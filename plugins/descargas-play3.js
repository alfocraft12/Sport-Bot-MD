import { exec } from 'child_process'
import fs from 'fs'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎵 Ingresa el nombre o enlace del video.')

  const id = Date.now()
  const output = `/tmp/audio-${id}.mp3`

  m.reply('🎧 Descargando audio, espera un momento...')

  exec(`yt-dlp -x --audio-format mp3 -o "${output}" "ytsearch1:${text}"`, async (err) => {
    if (err) {
      console.error(err)
      return m.reply('❌ Error al descargar.')
    }

    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(output),
      mimetype: 'audio/mpeg'
    }, { quoted: m })

    fs.unlinkSync(output)
  })
}

handler.command = ['play3']
handler.help = ['play3 <nombre>']
handler.tags = ['downloader']
handler.group = true

export default handler

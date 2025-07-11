const handler = async (m, { conn }) => {
  const q = m.quoted || m
  const msg = q?.msg || q
  const mime = msg?.mimetype || ''
  const isViewOnce = msg?.viewOnce

  if (!isViewOnce || !mime.startsWith('video/')) {
    return m.reply('🎥 Responde a un *video de una sola visualización* para desbloquearlo.')
  }

  try {
    const buffer = await q.download()
    if (!buffer) return m.reply('❌ No se pudo descargar el video.')

    await conn.sendMessage(m.chat, { video: buffer, caption: '🎥 Video desbloqueado.' }, { quoted: m })
  } catch (err) {
    console.error(err)
    m.reply('🚫 Ocurrió un error al intentar desbloquear el video.')
  }
}

handler.command = ['vervideo']
handler.help = ['vervideo (responde a un video viewOnce)']
handler.tags = ['tools']
handler.group = false

export default handler

const handler = async (m, { conn }) => {
  const q = m.quoted || m
  const msg = q?.msg || q
  const mime = msg?.mimetype || ''
  const isViewOnce = msg?.viewOnce

  if (!isViewOnce || !mime.startsWith('image/')) {
    return m.reply('🖼️ Responde a una *imagen de una sola visualización* para desbloquearla.')
  }

  try {
    const buffer = await q.download()
    if (!buffer) return m.reply('❌ No se pudo descargar la imagen.')

    await conn.sendMessage(m.chat, { image: buffer, caption: '🖼️ Imagen desbloqueada.' }, { quoted: m })
  } catch (err) {
    console.error(err)
    m.reply('🚫 Ocurrió un error al intentar desbloquear la imagen.')
  }
}

handler.command = ['verfoto']
handler.help = ['verfoto (responde a una foto viewOnce)']
handler.tags = ['tools']
handler.group = false

export default handler

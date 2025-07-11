const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const msg = q.msg || q

  // Detectar si es un audio "ver una vez"
  if (!msg?.viewOnce || !msg?.mimetype?.startsWith('audio')) {
    return m.reply('🎧 Responde a un audio con vista única para desbloquearlo.')
  }

  try {
    const audioBuffer = await q.download()
    if (!audioBuffer) return m.reply('❌ No se pudo descargar el audio.')

    // Reenviar como audio normal
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: msg.mimetype,
      ptt: msg.ptt || false, // si era nota de voz, se mantiene
      waveform: msg.waveform || undefined,
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('❌ Ocurrió un error al intentar convertir el audio.')
  }
}

handler.command = ['veraudio', 'desbloquearaudio', 'audio']
handler.help = ['veraudio (responde al audio 1 vez)']
handler.tags = ['tools']
handler.group = false // puedes poner true si quieres solo en grupos

export default handler

let handler = async (m, { conn, text, isAdmin }) => {
    // Verificar si es administrador
    if (!isAdmin) {
        return conn.reply(m.chat, '❌ Solo los administradores del grupo pueden usar este comando.', m)
    }

    // Hora proporcionada por el usuario (opcional)
    let hora = text ? text.trim() : '8:30 PM'

    // ============ AQUÍ VA EL MENSAJE DEL ANUNCIO ============
    let mensajeDevocional = `🙏 *¡Te invitamos al Devocional de hoy!*

Acompáñanos en este momento especial de reflexión y crecimiento espiritual.

👥 *Todos están invitados*
💝 *Ven como estés, Dios te ama*

——————————————
*⏰ Hora:* ${hora}
——————————————
*📱 Anunciado por:* @${m.sender.split('@')[0]}

${global.md}`.trim()

    // Enviar imagen con texto
    await conn.sendFile(m.chat, './src/kertas/devocionales.jpg', 'devocionales.jpg', mensajeDevocional, m)
}

handler.help = ['devocionales']
handler.tags = ['admin']
handler.command = ['devocionales', 'devocional']
handler.admin = true
handler.group = true
handler.register = false

export default handler

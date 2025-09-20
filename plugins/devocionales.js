let handler = async (m, { conn, text, isAdmin }) => {
    // Verificar si es administrador
    if (!isAdmin) {
        return conn.reply(m.chat, '❌ Solo los administradores del grupo pueden usar este comando.', m)
    }

    // ============ AQUÍ VA EL MENSAJE DEL ANUNCIO ============
    let mensajeDevocional = `🙏 *¡Te invitamos al Devocional de hoy!*

Acompáñanos en este momento especial de reflexión y crecimiento espiritual.

👥 *Todos están invitados*
💝 *Ven como estés, Dios te ama*`
    // =====================================================

    // Hora proporcionada por el usuario (opcional)
    let hora = text ? text.trim() : '8:30 PM'

    // Generar link único de Google Meet
    let generarLinkMeet = () => {
        let chars = 'abcdefghijklmnopqrstuvwxyz'
        let nums = '0123456789'
        
        let randomString = (length, charset) => {
            let result = ''
            for (let i = 0; i < length; i++) {
                result += charset.charAt(Math.floor(Math.random() * charset.length))
            }
            return result
        }
        
        let part1 = randomString(3, chars)
        let part2 = randomString(4, chars + nums)
        let part3 = randomString(3, chars)
        
        return `https://meet.google.com/${part1}-${part2}-${part3}`
    }

    // Generar el link único
    let linkDevocional = generarLinkMeet()

    // Crear el mensaje completo del anuncio
    let anuncioCompleto = `${mensajeDevocional}

——————————————
*🔗 Link de acceso:*
${linkDevocional}

*⏰ Hora:* ${hora}
——————————————
*📱 Anunciado por:* @${m.sender.split('@')[0]}`.trim()

    // ============ AQUÍ PONES LA RUTA DE TU IMAGEN ============
    // Enviar imagen con el anuncio
    await conn.sendFile(m.chat, './src/kertas/devocionales.jpg', 'devocionales.jpg', anuncioCompleto, m, false, { mentions: [m.sender] })
}

handler.help = ['devocionales']
handler.tags = ['admin']
handler.command = ['devocionales', 'devocional']
handler.admin = true
handler.group = true
handler.register = false

export default handler

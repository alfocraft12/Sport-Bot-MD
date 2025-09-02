import { setExclusiveUser, removeExclusiveUser, getExclusiveUser } from '../lib/exclusive.js'

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos')
    
    // Solo el owner del bot o admins del grupo pueden usar este comando
    if (!isOwner && !isAdmin) {
        return m.reply('❌ Solo los administradores o el owner pueden usar este comando')
    }
    
    if (!text) {
        // Mostrar usuario actual
        const currentExclusive = getExclusiveUser(m.chat)
        if (!currentExclusive) {
            return m.reply('📋 No hay ningún usuario exclusivo configurado\n\n*Uso:*\n• `.only @usuario` - Establecer usuario exclusivo\n• `.only off` - Desactivar modo exclusivo')
        }
        
        const user = participants.find(p => p.id === currentExclusive)
        const userName = user ? `@${user.id.split('@')[0]}` : 'Usuario no encontrado'
        return m.reply(`📋 Usuario exclusivo actual: ${userName}`, null, { mentions: [currentExclusive] })
    }
    
    // Desactivar modo exclusivo
    if (text.toLowerCase() === 'off' || text.toLowerCase() === 'disable') {
        removeExclusiveUser(m.chat)
        return m.reply('✅ Modo exclusivo desactivado. Todos los usuarios pueden usar el bot nuevamente')
    }
    
    // Obtener usuario mencionado
    let mentionedUser = m.mentionedJid && m.mentionedJid[0]
    
    if (!mentionedUser) {
        return m.reply('❌ Debes mencionar a un usuario\n\n*Ejemplo:* `.only @usuario`')
    }
    
    // Verificar que el usuario esté en el grupo
    const userInGroup = participants.find(p => p.id === mentionedUser)
    if (!userInGroup) {
        return m.reply('❌ El usuario mencionado no está en este grupo')
    }
    
    // Establecer usuario exclusivo
    setExclusiveUser(m.chat, mentionedUser)
    
    const userName = `@${mentionedUser.split('@')[0]}`
    m.reply(`✅ Bot configurado en modo exclusivo\n\n👤 Solo ${userName} puede usar los comandos en este grupo`, null, {
        mentions: [mentionedUser]
    })
}

handler.help = ['only']
handler.tags = ['owner', 'admin']
handler.command = /^(only|solo)$/i
handler.group = true
handler.admin = false
handler.owner = true

export default handler

import { isExclusiveActive, getExclusiveUser } from './exclusive.js'

export function checkExclusiveAccess(m) {
    // Solo verificar en grupos
    if (!m.isGroup) return true
    
    // Si es el owner del bot, SIEMPRE puede usar comandos (BYPASS COMPLETO)
    if (m.isOwner) return true
    
    // Verificar si el usuario puede usar comandos
    const canUse = isExclusiveActive(m.chat, m.sender)
    
    if (!canUse) {
        const exclusiveUser = getExclusiveUser(m.chat)
        const userName = `@${exclusiveUser.split('@')[0]}`
        m.reply(`🚫 El bot está configurado para que solo ${userName} lo pueda usar`, null, {
            mentions: [exclusiveUser]
        })
    }
    
    return canUse
}

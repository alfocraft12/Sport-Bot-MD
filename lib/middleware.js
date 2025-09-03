import { isExclusiveActive, getExclusiveUser } from './exclusive.js'

export function checkExclusiveAccess(m) {
    // Solo verificar en grupos
    if (!m.isGroup) return true
    
    // Verificar owner del bot usando la misma lógica de tu handler
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
    const isROwner = global.owner
        .filter(ownerData => Array.isArray(ownerData) && ownerData[0])
        .map(ownerData => String(ownerData[0]).replace(/[^0-9]/g, '') + detectwhat)
        .includes(m.sender)
    
    // Si es el owner del bot o el mensaje viene del bot mismo, SIEMPRE puede usar comandos
    if (isROwner || m.fromMe) return true
    
    // Verificar si el usuario puede usar comandos
    const canUse = isExclusiveActive(m.chat, m.sender)
    
    if (!canUse) {
        const exclusiveUser = getExclusiveUser(m.chat)
        if (exclusiveUser) {
            const userName = `@${exclusiveUser.split('@')[0]}`
            m.reply(`🚫 El bot está configurado para que solo ${userName} lo pueda usar`, null, {
                mentions: [exclusiveUser]
            })
        }
    }
    
    return canUse
}

iimport { isExclusiveActive, getExclusiveUser } from './exclusive.js'

export function checkExclusiveAccess(m) {
    // Solo verificar en grupos
    if (!m.isGroup) return true
    
    // Debug: verificar qué variables están disponibles
    console.log('DEBUG - Sender:', m.sender)
    console.log('DEBUG - isOwner:', m.isOwner)
    console.log('DEBUG - fromMe:', m.fromMe)
    
    // Verificar owner del bot usando las variables de tu handler
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
    const isROwner = global.owner
        .filter(ownerData => Array.isArray(ownerData) && ownerData[0])
        .map(ownerData => String(ownerData[0]).replace(/[^0-9]/g, '') + detectwhat)
        .includes(m.sender)
    
    console.log('DEBUG - isROwner:', isROwner)
    
    // Si es el owner del bot, SIEMPRE puede usar comandos
    if (isROwner || m.fromMe) return true
    
    // Verificar si el usuario puede usar comandos
    const canUse = isExclusiveActive(m.chat, m.sender)
    
    console.log('DEBUG - canUse:', canUse)
    
    if (!canUse) {
        const exclusiveUser = getExclusiveUser(m.chat)
        const userName = `@${exclusiveUser.split('@')[0]}`
        console.log('DEBUG - Blocking user, exclusive is:', exclusiveUser)
        m.reply(`🚫 El bot está configurado para que solo ${userName} lo pueda usar`, null, {
            mentions: [exclusiveUser]
        })
    }
    
    return canUse
}

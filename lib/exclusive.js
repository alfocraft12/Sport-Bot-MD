import fs from 'fs'

const exclusiveFile = './data/exclusive.json'

// Crear archivo si no existe
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true })
}

if (!fs.existsSync(exclusiveFile)) {
    fs.writeFileSync(exclusiveFile, JSON.stringify({}), 'utf8')
}

export function setExclusiveUser(groupId, userId) {
    let data = {}
    try {
        data = JSON.parse(fs.readFileSync(exclusiveFile, 'utf8'))
    } catch (e) {
        data = {}
    }
    
    data[groupId] = userId
    fs.writeFileSync(exclusiveFile, JSON.stringify(data, null, 2), 'utf8')
}

export function getExclusiveUser(groupId) {
    try {
        const data = JSON.parse(fs.readFileSync(exclusiveFile, 'utf8'))
        return data[groupId] || null
    } catch (e) {
        return null
    }
}

export function removeExclusiveUser(groupId) {
    try {
        const data = JSON.parse(fs.readFileSync(exclusiveFile, 'utf8'))
        delete data[groupId]
        fs.writeFileSync(exclusiveFile, JSON.stringify(data, null, 2), 'utf8')
    } catch (e) {
        console.error('Error removing exclusive user:', e)
    }
}

export function isExclusiveActive(groupId, userId) {
    const exclusiveUser = getExclusiveUser(groupId)
    if (!exclusiveUser) return true // Si no hay usuario exclusivo, todos pueden usar
    return exclusiveUser === userId
}

let handler = async (m, { conn, usedPrefix, command}) => {

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

let yaemori = `🎮 *REGLAS GENERALES* 🎮

- *Se jugarán un total de 3 mapas:* (B / P / K) 🗺

🚫 *REGLAS DE JUEGO* 🚫

- No se permitirá el uso de hacks, bugs o cualquier tipo de trampa..
- No se permite PC 💻
- No se permitirá el teaming (colaboración entre equipos).. 
- No se permitirá el glitch (explotar errores del juego).. 
- Los jugadores deben estar presentes en la sala de espera de 3 a 5 minutos antes del inicio del Scrim ⏰
- Cualquier habilidad es válida..

🚨 *REGLAS DE CASTIGO* 🚨

- 1er aviso: advertencia⚠
- 2do aviso: expulsión temporal del Scrim🚫
- 3er aviso: expulsión permanente del Scrim👋🏻
- Hacer emote: -10 puntos. 
- Uso de lista de eliminación: -15.
- Cualquier queja con cap: 📲
- spam en la sala -10.
- por cada jugador faltante -5.

📊 *REGLAS DE PUNTAJES* 📊

- Se otorgarán puntos por cada victoria en un mapa🏆
- 1 kill = 1 pts💀
- El equipo con más puntos al final de los 3 mapas será declarado ganador🏆

*•REGLAS DE COMPORTAMIENTO•*

- Los jugadores deben comportarse de manera respetuos

${global.md}`.trim()
await conn.reply(m.chat, yaemori, m, fake)

}
handler.help = ['botreglas']
handler.tags = ['main']
handler.command = ['botreglas', 'reglasdelbot', 'reglasbot', 'reglas']
handler.register = false
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}

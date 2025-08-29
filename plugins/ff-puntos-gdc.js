let handler = async (m, { conn, usedPrefix, command}) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

let yaemori = `*🔝 SISTEMA DE PUNTOS EN GUERRA DE CLANES Br 🔝*

🪖 La guerra de clanes en modo BR conlleva la siguiente estructura:

🫳Por cada kill que una persona haga, se le sumara 4 puntos y el sistema de tops es así:

----------------------------

*🎖TOP 1:* 12 pts

*🎖TOP 2:* 9 pts

*🎖TOP 3:* 8 pts

*🎖TOP 4:* 7 pts

*🎖TOP 5:* 6 pts

*🎖TOP 6:* 5 pts

*🎖TOP 7:* 4 pts

*🎖TOP 8:* 3 pts

*🎖TOP 9:* 2 pts

*🎖TOP 10:* 1 pts

*🎖TOP 11:* 0 pts

*🎖TOP 12:* 0 pts

----------------------------

*Ejemplo:*
_Un jugador llega a Booyah con 5 kills_

*🎖TOP 1:* 12 pts

*☠Kills:* 20 pts
----------------------------
> 12 + 20 = 32
----------------------------

🏆Con esto el jugador obtiene un total de *32 puntos.*

A los jugadores solo les cuentan las *5 mejores partidas.*

_Es decir:_

> 🔺Si la menor partida del jugador es un booyah con 4 kills, la siguiente partida tiene que ser de 1 booyah 5 kills, y así entre los tops.🔻

Es todo 😊
${global.md}`.trim()

// Enviar la imagen con el texto
await conn.sendFile(m.chat, 'src/freefire/guerra-de-clanes.jpg', 'guerra-de-clanes.jpg', yaemori, m, false, { contextInfo: fkontak })
}

handler.help = ['guerra de clanes']
handler.tags = ['free fire']
handler.command = ['puntosgdc', 'gdcpuntos']
handler.register = false
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}

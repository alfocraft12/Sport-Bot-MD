let handler = async (m, { isPrems, conn }) => {
let time = global.db.data.users[m.sender].lastcofre + 0 // 36000000 10 Horas //86400000 24 Horas
if (new Date - global.db.data.users[m.sender].lastcofre < 0) throw `[❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚂𝚃𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴\𝚗𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - new Date())}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚁`

let img = 'https://qu.ax/jaxPN.jpg' 
let texto = `» BIENVENIDO QUERIDO USUARIO!

“ HOLA *, ESTE ES EL MENU DE FN-𝐁𝐎𝐓 🤖 "

EN QUE PUEDO SERVIRTE!! ”

‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
╰──⬣╰──⬣╰──⬣╰──⬣╰──⬣╰──⬣

			L I S T A  -  M E N Ú S

╭──⚔️「 Info 📚 」⚡
│  👑◦ .formarpareja
│  👑◦ .owner
│  👑◦ .status
│  👑◦ .totalfunciones
│  👑◦ .menu
│  👑◦ .menu2
│  👑◦ .ping
│  👑◦ .runtime
│  👑◦ .script
│  👑◦ .menuff
╰──⚔️

╭──⚔️「 Busquedas 🔎 」⚡
│  👑◦ .mercadolibre <búsqueda>
│  👑◦ .pinterest
│  👑◦ .soundsearch <búsqueda>
│  👑◦ .tiktoksearch *<txt>*
│  👑◦ .ytsearch <búsqueda>
╰──⚔️

╭──⚔️「 Juegos 🎮 」⚡
│  👑◦ .apostar *<cantidad>*
╰──⚔️

╭──⚔️「 RPG 🌠 」⚡
│  👑◦ .claim
│  👑◦ .crimen
│  👑◦ .dardulces *@user <cantidad>*
│  👑◦ .dulces
│  👑◦ .minar
│  👑◦ .work
╰──⚔️

╭──⚔️「 Registro 📁 」⚡
│  👑◦ .sn
│  👑◦ .perfil
│  👑◦ .perfil @user
│  👑◦ .reg *<nombre.edad>*
│  👑◦ .unreg
╰──⚔️

╭──⚔️「 Stickers 🏞 」⚡
│  👑◦ .img (reply)
│  👑◦ .quotly <texto>
│  👑◦ .scat
│  👑◦ .sticker
│  👑◦ .wm <nombre>|<autor>
│  👑◦ .tovid <sticker>
╰──⚔️

╭──⚔️「 Imágenes 📸 」⚡
│  👑◦ .tiktokimg *<url>*
│  👑◦ .neko
│  👑◦ .pinterest <búsqueda>
│  👑◦ .ppcouple
│  👑◦ .waifu
╰──⚔️

╭──⚔️「 Free Fire 📌 」⚡
│  👑◦ .12vs12
│  👑◦ .16vs16
│  👑◦ .20vs20
│  👑◦ .24vs24
│  👑◦ .4vs4
│  👑◦ .6vs6
│  👑◦ .8vs8
│  👑◦ .interna4
│  👑◦ .cuadrilatero
│  👑◦ .reglaslideres
│  👑◦ .reglaslideres2
│  👑◦ .scrim
│  👑◦ .menuff
╰──⚔️

╭──⚔️「 Grupos 👥 」⚡
│  👑◦ .advertencia @user
│  👑◦ .banearbot
│  👑◦ .group open / close
│  👑◦ .grupo abrir / cerrar
│  👑◦ .del
│  👑◦ .fantasmas
│  👑◦ .hidetag
│  👑◦ .kick @user
│  👑◦ .encuesta *<pregunta|opciones>*
│  👑◦ .promote @usuario*
│  👑◦ .setppgc
│  👑◦ .setwelcome @user + texto
│  👑◦ .todos
│  👑◦ .desbanearbot
│  👑◦ .demote *@usuario*
│  👑◦ .setbye @user + texto
│  👑◦ .ds
╰──⚔️

╭──⚔️「 On / Off 📴 」⚡
│  👑◦ .enable
│  👑◦ .disable
╰──⚔️

╭──⚔️「 Descargas 📥 」⚡
│  👑◦ .instagram <url ig>
│  👑◦ .pindl <pin url>
│  👑◦ .play *<búsqueda>*
│  👑◦ .soundcloud *<búsqueda>*
│  👑◦ .spotifydl *<url spotify>*
│  👑◦ .tiktok <url tt>
│  👑◦ .tiktokimg *<url>*
│  👑◦ .imagen + Texto
│  👑◦ .ytmp3 <yt url>
│  👑◦ .ytmp4 <yt url>
╰──⚔️

╭──⚔️「 Herramientas 🔧 」⚡
│  👑◦ .base64 <enc/dec>
│  👑◦ .fake <texto/@tag/texto>
│  👑◦ .hd
│  👑◦ .ibb
│  👑◦ .igstalk <username>
│  👑◦ .morse <encode|decode>
│  👑◦ .ver
│  👑◦ .reenviar
│  👑◦ .ss *<url>*
│  👑◦ .ssweb *<url>*
│  👑◦ .togifaud
│  👑◦ .tomp3
│  👑◦ .tourl2
│  👑◦ .tourl
│  👑◦ .tovid <sticker>
│  👑◦ .tts <texto>
│  👑◦ .whatmusic <audio/video>
╰──⚔️

╭──⚔️「 Diversión 🎲 」⚡
│  👑◦ .formarpareja
│  👑◦ .formartrio
│  👑◦ .personalidad *<nombre>*
│  👑◦ .love
│  👑◦ .sorteo
│  👑◦ .abrazar <@usuario>
│  👑◦ .acariciar @tag
│  👑◦ .afk <razón>
│  👑◦ .gay <@tag> | <nombre>
│  👑◦ .lesbiana <@tag> | <nombre>
│  👑◦ .pajero <@tag> | <nombre>
│  👑◦ .pajera <@tag> | <nombre>
│  👑◦ .puto <@tag> | <nombre>
│  👑◦ .puta <@tag> | <nombre>
│  👑◦ .manco <@tag> | <nombre>
│  👑◦ .manca <@tag> | <nombre>
│  👑◦ .rata <@tag> | <nombre>
│  👑◦ .prostituta <@tag> | <nombre>
│  👑◦ .prostituto <@tag> | <nombre>
│  👑◦ .consejo
│  👑◦ .dance *<@user>*
│  👑◦ .doxear <nombre> | <@tag>
│  👑◦ .follar
│  👑◦ .formarpareja
│  👑◦ .gay2
│  👑◦ .horny
│  👑◦ .iqtest
│  👑◦ .love *@user*
│  👑◦ .lov2 @tag | nombre
│  👑◦ .cachuda @tag | nombre
│  👑◦ .negra @tag | nombre
│  👑◦ .adoptado @tag | nombre
│  👑◦ .sintetas @tag | nombre
│  👑◦ .sinpoto @tag | nombre
│  👑◦ .sinpito @tag | nombre
│  👑◦ .feo @tag | nombre
│  👑◦ .cachudo @tag | nombre
│  👑◦ .fea @tag | nombre
│  👑◦ .negro @tag | nombre
│  👑◦ .adoptada @tag | nombre
│  👑◦ .nombreninja *<texto>*
│  👑◦ .ppt
│  👑◦ .reto
│  👑◦ .ship
│  👑◦ .top *<texto>*
│  👑◦ .pokedex <pokemon>
╰──⚔️

╭──⚔️「 Nsfw 🔞 」⚡
│  👑◦ .nsfwloli
│  👑◦ .nsfwfoot
│  👑◦ .nsfwass
│  👑◦ .nsfwbdsm
│  👑◦ .nsfwcum
│  👑◦ .nsfwero
│  👑◦ .nsfwfemdom
│  👑◦ .nsfwfoot
│  👑◦ .nsfwglass
│  👑◦ .nsfworgy
│  👑◦ .yuri
│  👑◦ .yuri2
│  👑◦ .yaoi
│  👑◦ .yaoi2
│  👑◦ .panties
│  👑◦ .tetas
│  👑◦ .booty
│  👑◦ .ecchi
│  👑◦ .furro
│  👑◦ .hentai
│  👑◦ .trapito
│  👑◦ .imagenlesbians
│  👑◦ .pene
│  👑◦ .porno
│  👑◦ .randomxxx
│  👑◦ .pechos
╰──⚔️

╭──⚔️「 Creador 😺 」⚡
│  👑◦ .autoadmin
│  👑◦ .ban *@user*
│  👑◦ .getdb
│  👑◦ .getsesion
│  👑◦ .join <link>
│  👑◦ .reiniciar
│  👑◦ .salir
│  👑◦ .unban *@user*
│  👑◦ .update
╰──⚔️

╭──⚔️「 Audios 🔉 」⚡
│  👑◦ .bass <mp3/vn>
│  👑◦ .blown <mp3/vn>
│  👑◦ .deep <mp3/vn>
│  👑◦ .earrape <mp3/vn>
│  👑◦ .fast <mp3/vn>
│  👑◦ .fat <mp3/vn>
│  👑◦ .nightcore <mp3/vn>
│  👑◦ .reverse <mp3/vn>
│  👑◦ .robot <mp3/vn>
│  👑◦ .slow <mp3/vn>
│  👑◦ .smooth <mp3/vn>
│  👑◦ .tupai <mp3/vn>
│  👑◦ .reverb <mp3/vn>
│  👑◦ .chorus <mp3/vn>
│  👑◦ .flanger <mp3/vn>
│  👑◦ .distortion <mp3/vn>
│  👑◦ .pitch <mp3/vn>
│  👑◦ .highpass <mp3/vn>
│  👑◦ .lowpass <mp3/vn>
│  👑◦ .underwater <mp3/vn>
│  👑◦ .menu2
╰──⚔️

╭──⚔️「 Avanzado 💠 」⚡
│  👑◦ $
╰──⚔️

╭──⚔️「 Anime 👑 」⚡
│  👑◦ .akira
│  👑◦ .akiyama
│  👑◦ .anna
│  👑◦ .asuna
│  👑◦ .ayuzawa
│  👑◦ .boruto
│  👑◦ .chiho
│  👑◦ .chitoge
│  👑◦ .deidara
│  👑◦ .erza
│  👑◦ .elaina
│  👑◦ .eba
│  👑◦ .emilia
│  👑◦ .hestia
│  👑◦ .hinata
│  👑◦ .inori
│  👑◦ .isuzu
│  👑◦ .itachi
│  👑◦ .itori
│  👑◦ .kaga
│  👑◦ .kagura
│  👑◦ .kaori
│  👑◦ .keneki
│  👑◦ .kotori
│  👑◦ .kurumi
│  👑◦ .madara
│  👑◦ .mikasa
│  👑◦ .miku
│  👑◦ .minato
│  👑◦ .naruto
│  👑◦ .nezuko
│  👑◦ .sagiri
│  👑◦ .sasuke
│  👑◦ .sakura
│  👑◦ .pokedex <pokemon>
╰──⚔️

╭──⚔️「 General 」⚡
│  👑◦ .simsimi
╰──⚔️`

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
await conn.sendFile(m.chat, img, 'img.jpg', texto, fkontak)
global.db.data.users[m.sender].lastcofre = new Date * 1
}
handler.command = ['menu', 'menu1', 'menuu'] 
handler.register = true
handler.admin = true
export default handler

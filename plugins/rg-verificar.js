import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import axios from 'axios'

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

const handler = async function (m, { conn, text, usedPrefix, command }) {
  const user = global.db.data.users[m.sender]
  const name2 = conn.getName(m.sender)

  // Validar si ya está registrado — esto va primero
  if (user.registered === true)
    throw `🌴 Hola amigo, ya estás registrado en nuestra base de datos.`

  // Obtener país del usuario desde la API de Delirius
  let delirius = await axios.get(`https://delirius-apiofc.vercel.app/tools/country?text=${PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')}`)
  let paisdata = delirius?.data?.result
  let mundo = paisdata ? `${paisdata.name} ${paisdata.emoji}` : 'Desconocido'

  // Biografía del usuario
  let bio = 0, fechaBio
  let sinDefinir = '😿 Es privada'
  let biografia = await conn.fetchStatus(m.sender).catch(() => null)

  if (!biografia || !biografia[0] || biografia[0].status === null) {
    bio = sinDefinir
    fechaBio = "Fecha no disponible"
  } else {
    bio = biografia[0].status || sinDefinir
    fechaBio = biografia[0].setAt
      ? new Date(biografia[0].setAt).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "Fecha no disponible"
  }

  let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ =>
    'https://cdn.donmai.us/original/31/6d/__hu_tao_genshin_impact_drawn_by_pioko__316d40e84fd8b32cb4cac320728a3a10.jpg'
  )

  if (!Reg.test(text))
    throw `⛔ Regístrate bien.\nEjemplo:\n*${usedPrefix}reg DcA alfo.16*`

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '❌ El nombre no puede estar vacío.'
  if (!age) throw '❌ Por favor incluye tu edad después del punto.'
  if (name.length >= 30) throw '☘️ Por favor acorta tu nombre.'
  age = parseInt(age)
  if (age > 100) throw '☘️ Usa una edad más realista, menor a 100.'
  if (age < 5) throw '❌ No se permiten menores de 5 años.'

  // Guardar datos
  user.name = name.trim()
  user.age = age
  user.descripcion = bio
  user.regTime = +new Date()
  user.registered = true
  global.db.data.users[m.sender].money += 23
  global.db.data.users[m.sender].exp += 45
  global.db.data.users[m.sender].moras += 60

  // Código de registro
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const caption = `📃 *Registro completado*

🧑 Nombre: *${name}*
🎂 Edad: *${age}*
🌎 País: *${mundo}*
📝 Bio: *${bio}*

🆔 Código de registro:
*${sn}*

✅ ¡Ya estás registrado en nuestra comunidad!

📢 Canal oficial: 
https://whatsapp.com/channel/0029Vb3yM0T2v1ItNDrGIY3v
`

  await conn.sendFile(m.chat, pp, 'perfil.jpg', caption, m)
}

handler.help = ['verificar']
handler.tags = ['xp']
handler.command = /^(reg|Reg)$/i

export default handler

import { promises as fs } from 'fs'
import path from 'path'

var handler = async (m, { conn }) => {
  const mensaje = `
*GUERRA DE CLANES 🗣*
————————————

1. *HORARIOS 🕙:* 

- *🇻🇪 Venezuela:*
 8:00 pm - 12:00 pm

- *🇨🇴 Colombia:*
 7:00 pm - 11:00 pm

- *🇲🇽 México:* 
 6:00 pm - 10:00 pm


//////////////////////


2. *Días de guerra 🗓:*

- Miércoles 

- Sábados

- Domingos


//////////////////////


3. *Reglas 🚨:*

- Se Prohíbe *jugar otro modo* durante la guerra de clanes

- El estar activo y no aceptar también se considera como no aportar

- El *insultar a los jugadores* en el juego solo por ser "malos" también está prohibido (nada de toxicidad)

- Se necesitan personas dedicadas a la guerra (así sea los sábados y domingos)

————————————
Y con esto le damos las gracias y bienvenidas a todos, espero y la pasen bien ❤‍🩹 
————————————
> _*ATT:* Admins_
  `.trim()

  // Ruta relativa al archivo desde el mismo nivel del handler
  const imgPath = path.join('./src', 'guerra-de-clanes.jpeg')
  const buffer = await fs.readFile(imgPath)

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: mensaje
  }, { quoted: m })
}

handler.help = ['requisitos']
handler.tags = ['grupo']
handler.command = ['requisitos', 'gdc', 'guerra de clanes']

handler.group = true
handler.admin = true

export default handler

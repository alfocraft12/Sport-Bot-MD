import { promises as fs } from 'fs'
import path from 'path'

var handler = async (m, { conn }) => {
  const mensaje = `
*GUERRA DE CLANES ᴰᶜᴬ┆OŦɪςɪคL͆✯ 🗣*
————————————

*0. Líderes: 👑*

- *ᴰᶜᴬBarbie* _(líder principal)_

- *ᴰᶜᴬGuzman* _(líder interino)_

- *ᴰᶜᴬRojo* _(Decano)_

- *Malfeth* _(Decano)_

- *ᴰᶜᴬAlfo* _(Decano)_

*//////////////////////*


*1. HORARIOS 🕙:* 

- 🇻🇪 *Venezuela:*
 8:00 pm - 12:00 pm

- 🇨🇴 *Colombia:*
 7:00 pm - 11:00 pm

- 🇲🇽 *México:* 
 6:00 pm - 10:00 pm


*//////////////////////*


*2. Días de guerra 🗓:*

- Miércoles 

- Sábados

- Domingos


*//////////////////////*


*3. Requisitos: 📛*

- *150* puntos de guerra

- *Ser activo* en el clan y en WhatsApp.


*//////////////////////*

*4. Dinámicas: ⛵*

- *1er Lugar:* Un pase o lo equivalente a su valor

- *Posibles* dinámicas semanales

- Todos los que *cumplan* con el mínimo requerido (150) Entran a una dinámica para ganarse el pase o lo equivalente a su valor


*//////////////////////*


*5. Reglas 🚨:*

- Se Prohíbe jugar otro modo durante la guerra de clanes

- El estar activo y no aceptar también se considera como no aportar

- El insultar a los jugadores en el juego solo por ser *"malos"* también está prohibido (nada de toxicidad)

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
handler.command = ['dca', 'dcaoficial']

handler.group = true
handler.admin = true

export default handler

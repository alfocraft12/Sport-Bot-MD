let handler = async (m, { conn, command }) => {

let grupos =  `Hola, 
*➤ 𝙶𝚛𝚞𝚙𝚘𝚜 donde puedes encontrar el bot y hablar con amigos*
> *NO DISPONIBLE TEMPORALMENTE* 📛
`
await m.react('✖️')
await conn.sendFile(m.chat, imagen1, "hutao.jpg", grupos, fkontak, null, rcanal)}
                      
handler.command = ['grupos','linksk','gruposofc','gruposoficiales']
handler.register = false

export default handler

let handler = async (m, { conn }) => {
  let imagen = './src/freefire/bermuda.jpeg'
  await conn.sendFile(m.chat, imagen, 'bermuda.jpeg', '', m, false, global.channelRD)
}

handler.command = ['bermuda']
handler.group = true
export default handler

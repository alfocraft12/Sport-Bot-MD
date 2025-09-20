let handler = async (m, { conn, text, isAdmin }) => {
  if (!isAdmin) {
    return m.reply('❌ Solo administradores pueden usar este comando.')
  }

  try {
    // Tu mensaje
    let mensaje = `esta es una prueba alfo`
    
    // Hora
    let hora = text ? text.trim() : '8:30 PM'
    
    // Generar link
    let generarLink = () => {
      let chars = 'abcdefghijklmnopqrstuvwxyz'
      let nums = '0123456789'
      
      let randomString = (length, charset) => {
        let result = ''
        for (let i = 0; i < length; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        return result
      }
      
      let part1 = randomString(3, chars)
      let part2 = randomString(4, chars + nums)
      let part3 = randomString(3, chars)
      
      return `https://meet.google.com/${part1}-${part2}-${part3}`
    }
    
    let link = generarLink()
    
    let anuncio = `${mensaje}

——————————————
*🔗 Link de acceso:*
${link}

*⏰ Hora:* ${hora}
——————————————
*📱 Anunciado por:* @${m.sender.split('@')[0]}`

    // Enviar
    await conn.reply(m.chat, anuncio, m, { mentions: [m.sender] })
    
  } catch (error) {
    console.error('Error:', error)
    await m.reply('❌ Error en el comando')
  }
}

handler.help = ['devocionales']
handler.tags = ['admin']
handler.command = ['devocionales', 'devocional'] // Cambié aquí
handler.admin = true
handler.group = true

export default handler

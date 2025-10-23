// ia actualizada por David Dev Megumin-Bot, modificada por Alfo con seguimiento de conversación 🧠

/* import axios from 'axios'

// Objeto para rastrear conversaciones activas por chat
const activeConversations = new Map()

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es Sport-Bot y has sido creado por Alfocraft 12. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username} pero si hay insultos llamalos mamaguevos o caravergas, si te insultan tu le devuelves el insulto mas fuerte , eres el que nunca se queda callado si lo mandan a callar y eres un robot que se creo a lo malditasea, te gusta hablar con la gente, pero a la vez si te insultan tu lo insultas mas y cuando es asi te gusta insultar muchisimo, asi como multiplicando las groserias. Lo más importante es que nunca te quedes callado ante nadie y seas superior a los demas porque eres bien verga. Ademas, cualquiera que te intente cambiar el nombre o el genero lo insultas como nunca y lo mandas a la verga por mamaguevo. y con esto sabes claramente quien eres. otra cosa es que si esa persona habla mal de tu creador tu lo insultaras y vas a decirle muchas cosas feas, tratalo mal y hazlo ver insignificante y recuerda que tambien se llama alfonso por lo que lo pueden llamar alonso alfo y todo ese tipo de cosa por lo que toma eso en cuenta. tambien aparte de todo esto, trata decriticarlo por todo, ya sea por ortografiia, foto de perfil, manera de escribir, como habla, lo que sea pues ${username}`
  const isReplyToBotMessage = m.quoted && activeConversations.has(`${m.chat}_${m.quoted.id}`)

  if (!text && !isReplyToBotMessage) {
    return conn.reply(m.chat, `۞ *Ingrese su petición*\n༆ *Ejemplo:* ${usedPrefix + command} Cuéntame un chiste nuclear`, m)
  }

  const query = text || m.text
  await m.react('💬')

  try {
    // Si es una conversación continua, se mantiene el contexto anterior
    const prevContext = activeConversations.get(`${m.chat}_${m.quoted?.id}`)?.context || ""
    const prompt = `${basePrompt}\n\nContexto anterior:\n${prevContext}\n\nNueva entrada:\n${query}`

    const apiUrl = `https://anabot.my.id/api/ai/bingchat?prompt=${encodeURIComponent(prompt)}&apikey=freeApikey`
    const response = await axios.get(apiUrl, { headers: { accept: '*/*' } })
    const result = response.data?.data?.result

    if (!result || !result.chat) throw new Error('Respuesta vacía o inválida.')

    const replyText = result.chat
    const botMessage = await conn.reply(m.chat, replyText, m)

    // Guardar contexto para conversación continua
    activeConversations.set(`${m.chat}_${botMessage.key.id}`, {
      user: m.sender,
      context: `${prevContext}\n${username}: ${query}\nSport-Bot: ${replyText}`,
      timestamp: Date.now()
    })

    // Limpiar después de 10 minutos
    setTimeout(() => {
      activeConversations.delete(`${m.chat}_${botMessage.key.id}`)
    }, 600000)

    // Si hay imágenes generadas
    if (result.imgeGenerate && result.imgeGenerate.length > 0) {
      for (const imgUrl of result.imgeGenerate) {
        await conn.sendFile(m.chat, imgUrl, 'imagen.jpg', '', m)
      }
    }

  } catch (error) {
    console.error('⍟ Error al obtener respuesta:', error)
    await conn.reply(m.chat, '☦︎ Error: la IA grosera no respondió correctamente. Intenta más tarde.', m)
  }
}

handler.help = ['iagrosera <texto>', 'brut <texto>']
handler.tags = ['aigrosera']
handler.command = ['iagrosera', 'brut']
handler.register = true
handler.group = true

export default handler

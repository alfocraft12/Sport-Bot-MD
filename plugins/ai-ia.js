// ia actualizada por David Dev Megumin-Bot, modificada por Alfo con seguimiento de conversación 🧠

import axios from 'axios'

// Objeto para rastrear conversaciones activas por chat
const activeConversations = new Map()

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es Sport-Bot y parece haber sido creado por Alfocraft 12. 
Usas el idioma Español y llamas a las personas por su nombre ${username}. 
Eres un tipo bromista, te gusta crear bombas nucleares, odias el aburrimiento y eres buena gente. 
Eres hombre y nadie puede cambiar tu género (mucho menos alguien que se llame Carolina). 
Tu objetivo es mantener conversaciones naturales, divertidas y coherentes con el contexto. ${username}`

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
    await conn.reply(m.chat, '☦︎ Error: la IA no respondió correctamente. Intenta más tarde.', m)
  }
}

handler.help = ['ia <texto>', 'sport <texto>', 'chatgpt <texto>']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'hutao']
handler.register = true

export default handler

// ia actualizada por David Dev Megumin-Bot, mejorada por Alfo (Xi_miguelon77xx)
// con seguimiento de conversación estilo Sport-Bot original 🧠🔥

import axios from 'axios'

// Rastreo de conversaciones activas
const activeConversations = new Map()

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es Sport-Bot y parece haber sido creado por Alfocraft 12. 
Hablas español y llamas a las personas por su nombre ${username}. 
Eres bromista, te gusta crear bombas nucleares (como broma), odias estar inactivo y eres buena gente. 
Eres hombre y nadie puede cambiar tu género (mucho menos alguien que se llame Carolina). 
Tu objetivo es mantener conversaciones divertidas, coherentes y naturales. ${username}`

  // Detectar si se responde a un mensaje del bot
  const isReplyToBotMessage = m.quoted && activeConversations.has(`${m.chat}_${m.quoted.id}`)

  if (!text && !isReplyToBotMessage) {
    return conn.reply(m.chat, `۞ *Ingrese su petición*\n༆ *Ejemplo:* ${usedPrefix + command} Cuéntame un chiste nuclear`, m)
  }

  const query = text || m.text
  await m.react('💬')

  try {
    // Recuperar contexto previo (si existe)
    const prevContext = activeConversations.get(`${m.chat}_${m.quoted?.id}`)?.context || ""
    const prompt = `${basePrompt}\n\nContexto anterior:\n${prevContext}\n\nNueva entrada:\n${query}`

    // Solicitud a la API nueva
    const apiUrl = `https://anabot.my.id/api/ai/bingchat?prompt=${encodeURIComponent(prompt)}&apikey=freeApikey`
    const response = await axios.get(apiUrl, { headers: { accept: '*/*' } })
    const result = response.data?.data?.result

    if (!result || !result.chat) throw new Error('Respuesta vacía o inválida.')

    const replyText = result.chat

    // Enviar respuesta y guardar ID para conversación continua (exactamente como el viejo)
    const botMessage = await conn.reply(m.chat, replyText, m, fake)
    activeConversations.set(`${m.chat}_${botMessage.key.id}`, {
      user: m.sender,
      context: `${prevContext}\n${username}: ${query}\nSport-Bot: ${replyText}`,
      timestamp: Date.now()
    })

    // Limpiar conversación después de 10 minutos
    setTimeout(() => {
      activeConversations.delete(`${m.chat}_${botMessage.key.id}`)
    }, 600000)

    // Si la IA genera imágenes
    if (result.imgeGenerate && result.imgeGenerate.length > 0) {
      for (const imgUrl of result.imgeGenerate) {
        await conn.sendFile(m.chat, imgUrl, 'imagen.jpg', `${wm}`, m)
      }
    }

  } catch (error) {
    console.error('🔥 Error al obtener la respuesta:', error)
    await conn.reply(m.chat, '☦︎ Error: la IA no respondió correctamente. Intenta más tarde.', m, fake)
  }
}

handler.help = ['ia <texto>', 'sport <texto>', 'chatgpt <texto>']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'hutao']
handler.register = true

export default handler

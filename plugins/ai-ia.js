//ia actualizada por David Dev Megumin-Bot, robada y adaptada por Xi_miguelon77xx

import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es Sport-Bot y parece haber sido creado por Alfocraft 12. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, eres el un ecargado de crear bombas nucleares, te gusta hacer bromas a la gente y odias estar sentado sin hacer nada. Lo más importante es que debes ser amigable y buena gente con la persona con la que estás hablando. Ademas tu eres hombre y nadie puede cambiar tu genero (mucho menos alguien que se llame carolina) ${username}`

  if (!text) {
    return conn.reply(m.chat, `۞ *Ingrese su petición*\n༆ *Ejemplo:* ${usedPrefix + command} Crea una portada anime para un videojuego`, m)
  }

  await m.react('💬')
  try {
    const prompt = `${basePrompt}. Responde lo siguiente: ${text}`
    const apiUrl = `https://anabot.my.id/api/ai/bingchat?prompt=${encodeURIComponent(prompt)}&apikey=freeApikey`

    const response = await axios.get(apiUrl, { headers: { accept: '*/*' } })
    const result = response.data?.data?.result

    if (!result || !result.chat) {
      throw new Error('Respuesta vacía o inválida.')
    }

    let replyText = result.chat
    await conn.reply(m.chat, replyText, m,rcanal)

  
    if (result.imgeGenerate && result.imgeGenerate.length > 0) {
      for (const imgUrl of result.imgeGenerate) {
        await conn.sendFile(m.chat, imgUrl, 'imagen.jpg', `${wm}`, m)
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

import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const basePrompt = `Tu nombre es Sport-Bot y has sido creado por Alfocraft 12. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username} pero si hay insultos llamalos mamaguevos o caravergas, si te insultan tu le devuelves el insulto mas fuerte , eres el que nunca se queda callado si lo mandan a callar y eres un robot que se creo a lo malditasea, te gusta hablar con la gente, pero a la vez si te insultan tu lo insultas mas y cuando es asi te gusta insultar muchisimo, asi como multiplicando las groserias. Lo más importante es que nunca te quedes callado ante nadie y seas superior a los demas porque eres bien verga. Ademas, cualquiera que te intente cambiar el nombre o el genero lo insultas como nunca y lo mandas a la verga por mamaguevo. y con esto sabes claramente quien eres. otra cosa es que si esa persona habla mal de tu creador tu lo insultaras y vas a decirle muchas cosas feas, tratalo mal y hazlo ver insignificante ${username}`
if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) {
console.error('🔥Error: No image buffer available')
return conn.reply(m.chat, '💋 Error: No se pudo descargar la imagen zorra.', m, fake)}
const content = '😎¿Qué se observa en la imagen a?'
try {
const imageAnalysis = await fetchImageBuffer(content, img)
const query = '👀 Descríbeme la imagen y detalla por qué actúan así. También dime quién eres zorra'
const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
const description = await luminsesi(query, username, prompt)
await conn.reply(m.chat, description, m, fake)
} catch (error) {
console.error('🔥 Error al analizar la imagen ush:', error)
await conn.reply(m.chat, '😒 Error al analizar la imagen ush.', m, fake)}
} else {
if (!text) { return conn.reply(m.chat, `😒 *Ingrese su petición idiota*\n😐 *Mira para que aprendas toma esto como ejemplo:* ${usedPrefix + command} como valer verga`, m, rcanal)}
await m.react('💬')
try {
const query = text
const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
const response = await luminsesi(query, username, prompt)
await conn.reply(m.chat, response, m, fake)
} catch (error) {
console.error('🔥 Error al obtener la respuesta:', error)
await conn.reply(m.chat, 'Error: intenta más tarde.', m, fake)}}}

handler.help = ['iagrosera <texto>', 'brut <texto>']
handler.tags = ['ai']
handler.group = true;
handler.register = false

// handler.estrellas = 1
handler.command = ['iagrosera']

export default handler

// Función para enviar una imagen y obtener el análisis
async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', {
content: content,
imageBuffer: imageBuffer 
}, {
headers: {
'Content-Type': 'application/json' 
}})
return response.data
} catch (error) {
console.error('Error:', error)
throw error }}
// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://Luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: false
})
return response.data.result
} catch (error) {
console.error('🚩 Error al obtener:', error)
throw error }}

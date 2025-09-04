/* Codigo usando API externa sin canvas */
import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const handler = async (m, {conn, args, usedPrefix, command}) => {
    let text;
    
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else return conn.reply(m.chat, '⚠️ *Te faltó el texto!*\n\n📝 *Uso:* ' + usedPrefix + command + ' tu texto aquí', m, rcanal);
    
    if (!text) return conn.reply(m.chat, '⚠️ *Te faltó el texto!*', m, rcanal);
    
    // Limpiar menciones
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender; 
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
    const cleanText = text.replace(mentionRegex, '').trim();
    
    if (cleanText.length > 100) return conn.reply(m.chat, '⚠️ *El texto no puede tener más de 100 caracteres*', m, rcanal);
    if (cleanText.length < 1) return conn.reply(m.chat, '⚠️ *El texto es muy corto*', m, rcanal);
    
    try {
        await conn.reply(m.chat, '⏳ *Creando sticker de texto...*', m, rcanal);
        
        // Usar API externa para generar imagen de texto
        const imageBuffer = await generateTextImage(cleanText);
        let stiker = await sticker(imageBuffer, false, global.packsticker, global.author);
        
        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'textSticker.webp', '', m);
        } else {
            return conn.reply(m.chat, '❌ *Error al crear el sticker*', m, rcanal);
        }
        
    } catch (error) {
        console.error('Error:', error);
        return conn.reply(m.chat, '❌ *Error al crear el sticker. Intenta de nuevo.*', m, rcanal);
    }
}

// Función usando API externa
async function generateTextImage(text) {
    try {
        // Opción 1: API de DummyImage
        const fontSize = Math.max(20, Math.min(60, 500 / text.length));
        const url = `https://dummyimage.com/512x512/ffffff/000000.png&text=${encodeURIComponent(text)}`;
        
        const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            timeout: 10000 
        });
        
        return Buffer.from(response.data);
        
    } catch (error) {
        // Fallback: Usar otra API
        return await generateTextImageFallback(text);
    }
}

// API alternativa como fallback
async function generateTextImageFallback(text) {
    try {
        const response = await axios.post('https://api.htmlcsstoimage.com/v1/image', {
            html: `
                <div style="
                    width: 512px; 
                    height: 512px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    background: white; 
                    font-family: Arial, sans-serif; 
                    font-size: ${Math.max(20, Math.min(48, 400/text.length))}px; 
                    font-weight: bold; 
                    text-align: center; 
                    padding: 20px;
                    box-sizing: border-box;
                    word-wrap: break-word;
                    color: black;
                ">
                    ${text}
                </div>
            `,
            css: "body { margin: 0; }",
            google_fonts: "Arial"
        }, {
            timeout: 15000,
            responseType: 'arraybuffer'
        });
        
        return Buffer.from(response.data);
        
    } catch (error) {
        // Último recurso: imagen básica con URL
        const simpleUrl = `https://via.placeholder.com/512x512/FFFFFF/000000?text=${encodeURIComponent(text.slice(0, 30))}`;
        const response = await axios.get(simpleUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    }
}

handler.help = ['textosticker', 'ts', 'stick'];
handler.tags = ['sticker'];
handler.group = true;
handler.register = false;
handler.command = ['brat', 'texsbrat', 'stickbrat', 'textstickerb'];

export default handler;

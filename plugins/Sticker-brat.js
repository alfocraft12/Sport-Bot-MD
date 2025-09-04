/* Versión simple garantizada */
import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const handler = async (m, {conn, args, usedPrefix, command}) => {
    let text;
    
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else return conn.reply(m.chat, '⚠️ *Te faltó el texto!*', m, rcanal);
    
    if (!text) return conn.reply(m.chat, '⚠️ *Te faltó el texto!*', m, rcanal);
    
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender; 
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
    const cleanText = text.replace(mentionRegex, '').trim();
    
    if (cleanText.length > 50) return conn.reply(m.chat, '⚠️ *Máximo 50 caracteres*', m, rcanal);
    
    try {
        await conn.reply(m.chat, '⏳ *Creando sticker...*', m, rcanal);
        
        // URL simple pero con texto grande
        const textEncoded = encodeURIComponent(cleanText);
        const fontSize = Math.max(45, Math.min(85, 800/cleanText.length));
        
        // Usar placeholder con parámetros de tamaño
        const imageUrl = `https://via.placeholder.com/512x512/FFFFFF/000000.png?text=${textEncoded}&fontSize=${fontSize}`;
        
        const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 8000 
        });
        
        const imageBuffer = Buffer.from(response.data);
        let stiker = await sticker(imageBuffer, false, global.packsticker, global.author);
        
        if (stiker) return conn.sendFile(m.chat, stiker, 'textSticker.webp', '', m);
        
    } catch (error) {
        console.error('Error:', error);
        return conn.reply(m.chat, '❌ *Error al crear sticker*', m, rcanal);
    }
}

handler.help = ['ts'];
handler.tags = ['sticker'];
handler.command = ['brat', 'textstickerb'];

export default handler;

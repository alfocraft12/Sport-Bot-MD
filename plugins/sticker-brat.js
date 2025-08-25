import axios from 'axios';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSticker = async (text, attempt = 1) => {
    try {
        const response = await axios.get(`https://kepolu-brat.hf.space/brat`, {
            params: { q: text },
            responseType: 'arraybuffer',
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429 && attempt <= 3) {
            const retryAfter = error.response.headers['retry-after'] || 5;
            await delay(retryAfter * 1000);
            return fetchSticker(text, attempt + 1);
        }
        throw error;
    }
};

const handler = async (m, { text, conn }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: "⚠️ Ingresa un texto para hacer el sticker."
        }, { quoted: m });
    }

    try {
        const buffer = await fetchSticker(text);

        // Convertir el buffer a sticker válido con metadatos
        const sticker = new Sticker(buffer, {
            pack: 'Sport-Bot',     // nombre del pack
            author: 'Alfo',        // autor
            type: StickerTypes.FULL, // ajuste de tamaño
            quality: 80
        });

        await conn.sendMessage(m.chat, {
            sticker: await sticker.build()
        }, { quoted: m });

    } catch (error) {
        return conn.sendMessage(m.chat, {
            text: "❌ Ocurrió un error al generar el sticker."
        }, { quoted: m });
    }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat *<texto>*'];

export default handler;

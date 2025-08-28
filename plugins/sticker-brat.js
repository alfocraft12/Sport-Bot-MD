import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

// Importación segura de Sharp
let sharp = null;
try {
    const sharpModule = await import('sharp');
    sharp = sharpModule.default;
} catch (error) {
    console.warn('Sharp no disponible, stickers se crearán sin redimensionar');
}

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
            text: `Por favor ingresa el texto para hacer un sticker.`,
        }, { quoted: m });
    }

    try {
        const buffer = await fetchSticker(text);
        let stickerBuffer;

        if (sharp) {
            // Usar Sharp si está disponible
            const outputFilePath = path.join(tmpdir(), `sticker-${Date.now()}.webp`);
            
            await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .webp({ quality: 80 })
                .toFile(outputFilePath);
            
            // Lee el archivo como buffer
            stickerBuffer = fs.readFileSync(outputFilePath);
            
            // Limpia el archivo temporal
            fs.unlinkSync(outputFilePath);
        } else {
            // Usar el buffer original si Sharp no está disponible
            console.log('Usando imagen original (Sharp no disponible)');
            stickerBuffer = Buffer.from(buffer);
        }
        
        // Envía el sticker usando el buffer
        await conn.sendMessage(m.chat, {
            sticker: stickerBuffer
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error:', error);
        return conn.sendMessage(m.chat, {
            text: `Ocurrió un error al crear el sticker: ${error.message}`,
        }, { quoted: m });
    }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat *<texto>*'];

export default handler;

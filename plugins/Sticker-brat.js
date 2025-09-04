/* Codigo adaptado para stickers de texto simple */
import { sticker } from '../lib/sticker.js';
import { createCanvas, registerFont } from 'canvas';

const handler = async (m, {conn, args, usedPrefix, command}) => {
    let text;
    
    // Obtener el texto del comando o mensaje citado
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else return conn.reply(m.chat, '⚠️ *Te faltó el texto!*\n\n📝 *Uso:* ' + usedPrefix + command + ' tu texto aquí', m, rcanal);
    
    if (!text) return conn.reply(m.chat, '⚠️ *Te faltó el texto!*', m, rcanal);
    
    // Limpiar menciones del texto
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender; 
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
    const cleanText = text.replace(mentionRegex, '').trim();
    
    // Validar longitud del texto
    if (cleanText.length > 100) return conn.reply(m.chat, '⚠️ *El texto no puede tener más de 100 caracteres*', m, rcanal);
    if (cleanText.length < 1) return conn.reply(m.chat, '⚠️ *El texto es muy corto*', m, rcanal);
    
    try {
        // Mostrar mensaje de procesamiento
        await conn.reply(m.chat, '⏳ *Creando sticker de texto...*', m, rcanal);
        
        // Crear el sticker
        const buffer = await createTextStickerBuffer(cleanText);
        let stiker = await sticker(buffer, false, global.packsticker, global.author);
        
        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'textSticker.webp', '', m);
        } else {
            return conn.reply(m.chat, '❌ *Error al crear el sticker*', m, rcanal);
        }
        
    } catch (error) {
        console.error('Error creando sticker de texto:', error);
        return conn.reply(m.chat, '❌ *Ocurrió un error al crear el sticker*', m, rcanal);
    }
}

// Función para crear el buffer de imagen del sticker
async function createTextStickerBuffer(text) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    
    // Configuración
    const config = {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderColor: '#CCCCCC',
        padding: 30,
        borderRadius: 15,
        borderWidth: 2
    };
    
    // Limpiar canvas con fondo transparente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Crear fondo blanco con borde
    drawRoundedRect(
        ctx, 
        config.padding, 
        config.padding, 
        canvas.width - (config.padding * 2), 
        canvas.height - (config.padding * 2), 
        config.borderRadius,
        config.backgroundColor,
        config.borderColor,
        config.borderWidth
    );
    
    // Calcular tamaño de fuente dinámicamente
    const fontSize = calculateOptimalFontSize(text.length);
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Dividir texto en líneas
    const maxWidth = canvas.width - (config.padding * 2) - 40; // Margen adicional
    const lines = wrapText(ctx, text, maxWidth);
    
    // Calcular posición vertical centrada
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height / 2) - (totalHeight / 2) + (lineHeight / 2);
    
    // Dibujar texto línea por línea
    lines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        
        // Sombra del texto (opcional para mejor legibilidad)
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillText(line, (canvas.width / 2) + 1, y + 1);
        
        // Texto principal
        ctx.fillStyle = config.textColor;
        ctx.fillText(line, canvas.width / 2, y);
    });
    
    return canvas.toBuffer('image/png');
}

// Función para dibujar rectángulo con bordes redondeados
function drawRoundedRect(ctx, x, y, width, height, radius, fillColor, borderColor = null, borderWidth = 0) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    // Rellenar fondo
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    
    // Dibujar borde
    if (borderColor && borderWidth > 0) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.stroke();
    }
}

// Función para calcular el tamaño de fuente óptimo
function calculateOptimalFontSize(textLength) {
    if (textLength <= 5) return 64;
    if (textLength <= 10) return 52;
    if (textLength <= 15) return 44;
    if (textLength <= 25) return 38;
    if (textLength <= 35) return 32;
    if (textLength <= 50) return 28;
    if (textLength <= 75) return 24;
    return 20;
}

// Función para dividir texto en múltiples líneas
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    // Si solo hay una línea muy larga, dividirla por caracteres
    if (lines.length === 1 && ctx.measureText(lines[0]).width > maxWidth) {
        return breakLongLine(ctx, lines[0], maxWidth);
    }
    
    return lines;
}

// Función para dividir líneas muy largas por caracteres
function breakLongLine(ctx, text, maxWidth) {
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const width = ctx.measureText(currentLine + char).width;
        
        if (width < maxWidth) {
            currentLine += char;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = char;
        }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
}

// Configuración del handler
handler.help = ['textosticker', 'ts', 'stick'];
handler.tags = ['sticker'];
handler.group = true;
handler.register = false;
handler.command = ['brat', 'texsbrat', 'stickbrat', 'textstickerb'];

export default handler;

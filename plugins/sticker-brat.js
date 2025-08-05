// plugins/sticker-brat.js
import { createCanvas } from 'canvas';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

let handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`✳️ Usa el comando así:\n.${command} texto del sticker\n\nEjemplo:\n.${command} no me hables, tonto >:c`);
  }

  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  // Fondo brat rosado
  ctx.fillStyle = '#ffc0cb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Corazoncitos decorativos
  ctx.font = '30px Arial';
  ctx.fillStyle = '#ff69b4';
  ctx.fillText('💕', 30, 50);
  ctx.fillText('💗', 420, 80);
  ctx.fillText('💖', 200, 500);

  // Texto principal
  ctx.font = 'bold 34px Comic Sans MS';
  ctx.fillStyle = '#8b008b';
  ctx.textAlign = 'center';
  ctx.fillText(text.slice(0, 40), canvas.width / 2, canvas.height / 2);

  const buffer = canvas.toBuffer();

  const sticker = new Sticker(buffer, {
    pack: 'Modo Brat',
    author: 'Alfo',
    type: StickerTypes.FULL,
    quality: 80,
  });

  const stickerBuffer = await sticker.toBuffer();
  await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
};

handler.help = ['brat <texto>'];
handler.tags = ['fun'];
handler.command = /^brat$/i;

export default handler;

// devocional.js
import fs from 'fs'

let handler = async (m, { conn, text }) => {
  // ===== CONFIGURACIÓN =====
  const anuncioPredeterminado = "📖 Devocional familiar, no falten!";
  const horaPredeterminada = "8:00 PM"; 
  const imagenPath = './media/devocional.jpg'; // tu imagen en archivos del bot

  // ===== PROCESO =====
  let args = text.trim().split(/\s+/); // separa por espacios
  let hora = args[0] || horaPredeterminada;
  let link = args[1] || "⚠️ No se proporcionó un link de Meet";

  // ===== MENSAJE FINAL =====
  let mensaje = `
${anuncioPredeterminado}

🕒 Hora: *${hora}*
🔗 Link: ${link}
  `.trim();

  await conn.sendMessage(m.chat, { 
    image: fs.readFileSync(imagenPath), 
    caption: mensaje 
  }, { quoted: m });
}

handler.help = ["devocional [hora] [link]"];
handler.tags = ["tools"];
handler.command = /^devocional$/i; // regex correcto

export default handler;

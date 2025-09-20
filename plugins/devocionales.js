// meet.js
import fs from 'fs'

let handler = async (m, { conn, text }) => {
  // ===== CONFIGURACIÓN =====
  const anuncioPredeterminado = "📢 Reunión importante, no falten!";
  const horaPredeterminada = "8:00 PM"; 
  const imagenPath = './media/meet.jpg'; // tu imagen en archivos del bot

  // ===== PROCESO =====
  let args = text.split(" ");
  let hora = args[0] ? args[0] : horaPredeterminada;
  let link = args[1] ? args[1] : "🔗 (faltó poner el link de la reunión)";

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

handler.help = ["meet [hora] [link]"];
handler.tags = ["tools"];
handler.command = ["devocional"];

export default handler;

// meet.js
import fs from 'fs'

let handler = async (m, { conn, text }) => {
  // ===== CONFIGURACIÓN =====
  const anuncioPredeterminado = "📢 Reunión importante, no falten!";
  const horaPredeterminada = "8:00 PM"; // cámbiala si quieres un valor fijo
  const imagenPath = './src/kertas/devocionales.jpg'; // ruta de la imagen dentro de tu bot

  // ===== PROCESO =====
  let args = text.split(" ");
  let hora = args[0] ? args[0] : horaPredeterminada;

  // Generar un link random de Google Meet
  const caracteres = "abcdefghijklmnopqrstuvwxyz";
  const randomStr = () => Array.from({ length: 3 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('');
  let meetLink = `https://meet.google.com/${randomStr()}-${randomStr()}-${randomStr()}`;
  
  // ===== MENSAJE FINAL =====
  let mensaje = `
${anuncioPredeterminado}

🕒 Hora: *${hora}*
🔗 Link: ${meetLink}
  `.trim();

  await conn.sendMessage(m.chat, { 
    image: fs.readFileSync(imagenPath), 
    caption: mensaje 
  }, { quoted: m });
}

handler.help = ["meet [hora]"];
handler.tags = ["tools"];
handler.command = ["meet"];

export default handler;

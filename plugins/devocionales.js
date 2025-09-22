// devocional.js
import fs from 'fs'

let handler = async (m, { conn, text }) => {
  // ===== CONFIGURACIÓN =====
  const anuncioPredeterminado = "*Buenos dias Dios les bendiga a tod@s de una manera muy especial.*

Hoy es Lunes de devocional.
Tendremos un *predicador sorpresa 🙈*
Los animo a que aprovechen la oportunidad de tener un devocional cada lunes.

No se lo pierdan.
Los esperamos a todos.";
  const horaPredeterminada = "8:30 PM"; 
  const imagenPath = './src/kertas/devocionales2.jpg'; // tu imagen en archivos del bot

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

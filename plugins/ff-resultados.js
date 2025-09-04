import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

// Sistema de puntos según la imagen
const PUNTOS_POR_POSICION = {
  1: 12, 2: 10, 3: 9, 4: 8, 5: 7, 6: 6,
  7: 5, 8: 4, 9: 3, 10: 2, 11: 1, 12: 0
};

const handler = async (m, { conn, usedPrefix }) => {
  // Verificar si hay un mensaje citado
  if (!m.quoted) {
    return conn.reply(m.chat, '❌ Debes responder a un mensaje que contenga la ficha de resultados', m);
  }

  const fichaTexto = m.quoted.text;
  
  // Verificar si es una ficha válida
  if (!fichaTexto || !fichaTexto.includes('𝐍𝐨𝐦𝐛𝐫𝐞 𝐝𝐞𝐥 𝐞𝐪𝐮𝐢𝐩𝐨')) {
    return conn.reply(m.chat, '❌ El mensaje citado no contiene una ficha válida', m);
  }

  try {
    // Extraer datos de la ficha usando expresiones regulares
    const nombreMatch = fichaTexto.match(/📍𝐍𝐨𝐦𝐛𝐫𝐞 𝐝𝐞𝐥 𝐞𝐪𝐮𝐢𝐩𝐨:\s*(.+)/);
    const casillaMatch = fichaTexto.match(/📋𝐂𝐚𝐬𝐢𝐥𝐥𝐚:\s*#?\s*(\d+)/);
    const bMatch = fichaTexto.match(/🕹\|\s*𝐁\s*:\s*(\d+)/);
    const pMatch = fichaTexto.match(/🕹\|\s*𝐏\s*:\s*(\d+)/);
    const kMatch = fichaTexto.match(/🕹\|\s*𝐊\s*:\s*(\d+)/);
    const totalKillsMatch = fichaTexto.match(/☠\|\s*•\s*𝐓𝐨𝐭𝐚𝐥 𝐝𝐞 𝐤𝐢𝐥𝐥𝐬:\s*(\d+)/);

    // Validar que se encontraron todos los datos necesarios
    if (!nombreMatch || !casillaMatch || !totalKillsMatch) {
      return conn.reply(m.chat, '❌ No se pudieron extraer todos los datos de la ficha. Verifica el formato.', m);
    }

    const nombre = nombreMatch[1].trim();
    const casilla = parseInt(casillaMatch[1]);
    const totalKills = parseInt(totalKillsMatch[1]);

    // Validar casilla
    if (casilla < 1 || casilla > 12) {
      return conn.reply(m.chat, '❌ La casilla debe estar entre 1 y 12', m);
    }

    // Calcular puntos
    const puntosMapa = PUNTOS_POR_POSICION[casilla] || 0;
    const puntosKills = totalKills;
    const totalPuntos = puntosMapa + puntosKills;

    // Generar respuesta
    const resultado = `🏆 Resultado individual de scrim
——————————————
NOMBRE: ${nombre}
CASILLA: ${casilla}
——————————————
Puntos de mapa: ${puntosMapa}
Puntos de kills: ${puntosKills}
Total de puntos: ${totalPuntos}
——————————————
Incumplimiento de regla
no aplica`;

    // Reaccionar al mensaje original
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // Enviar resultado
    const doc = [
      "pdf",
      "zip",
      "vnd.openxmlformats-officedocument.presentationml.presentation",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const document = doc[Math.floor(Math.random() * doc.length)];
    
    const Message = {
      document: { url: `https://chat.whatsapp.com/H5bw4MJucS1BBHnZ9wv3vI` },
      mimetype: `application/${document}`,
      fileName: `「 Sport-Bot-MD - Resultado 」`,
      fileLength: 99999999999999,
      pageCount: 200,
      contextInfo: {
        forwardingScore: 200,
        isForwarded: true,
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 0x1,
          previewType: "PHOTO",
          title: "🏆 Resultado del Torneo",
          thumbnail: imagen10,
          renderLargerThumbnail: true,
          sourceUrl: "https://chat.whatsapp.com/KxHaM2J0NWPDR4RU24OmFw",
        },
      },
      caption: resultado,
      footer: wm,
      headerType: 6,
    };
    
    await conn.sendMessage(m.chat, Message, { quoted: m });

  } catch (error) {
    console.error('Error procesando ficha:', error);
    return conn.reply(m.chat, '❌ Ocurrió un error al procesar la ficha. Verifica el formato.', m);
  }
};

handler.help = ["resultados"];
handler.tags = ["torneo", "games", "free fire"];
handler.command = ['resultados', 'resultado'];
handler.register = false;

export default handler;

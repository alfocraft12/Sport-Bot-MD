const handler = async (m, { conn, usedPrefix }) => {
  // Verificar si hay un mensaje citado
  if (!m.quoted) {
    return conn.reply(m.chat, '❌ Debes responder a un mensaje que contenga la ficha de resultados', m);
  }

  const fichaTexto = m.quoted.text || m.quoted.caption || '';
  
  // Verificar si es una ficha válida
  if (!fichaTexto || !fichaTexto.includes('𝐍𝐨𝐦𝐛𝐫𝐞 𝐝𝐞𝐥 𝐞𝐪𝐮𝐢𝐩𝐨') && !fichaTexto.includes('Nombre del equipo')) {
    return conn.reply(m.chat, '❌ El mensaje citado no contiene una ficha válida', m);
  }

  try {
    // Sistema de puntos según la imagen
    const PUNTOS_POR_POSICION = {
      1: 12, 2: 10, 3: 9, 4: 8, 5: 7, 6: 6,
      7: 5, 8: 4, 9: 3, 10: 2, 11: 1, 12: 0
    };

    // Extraer datos de la ficha usando múltiples patrones
    let nombre = '';
    let casilla = 0;
    let totalKills = 0;

    // Intentar extraer nombre del equipo
    const nombrePatterns = [
      /📍𝐍𝐨𝐦𝐛𝐫𝐞 𝐝𝐞𝐥 𝐞𝐪𝐮𝐢𝐩𝐨:\s*(.+)/,
      /Nombre del equipo:\s*(.+)/,
      /NOMBRE:\s*(.+)/
    ];

    for (const pattern of nombrePatterns) {
      const match = fichaTexto.match(pattern);
      if (match) {
        nombre = match[1].trim();
        break;
      }
    }

    // Intentar extraer casilla
    const casillaPatterns = [
      /📋𝐂𝐚𝐬𝐢𝐥𝐥𝐚:\s*#?\s*(\d+)/,
      /Casilla:\s*#?\s*(\d+)/,
      /CASILLA:\s*#?\s*(\d+)/
    ];

    for (const pattern of casillaPatterns) {
      const match = fichaTexto.match(pattern);
      if (match) {
        casilla = parseInt(match[1]);
        break;
      }
    }

    // Intentar extraer total de kills
    const killsPatterns = [
      /☠\|\s*•\s*𝐓𝐨𝐭𝐚𝐥 𝐝𝐞 𝐤𝐢𝐥𝐥𝐬:\s*(\d+)/,
      /Total de kills:\s*(\d+)/,
      /TOTAL:\s*(\d+)/
    ];

    for (const pattern of killsPatterns) {
      const match = fichaTexto.match(pattern);
      if (match) {
        totalKills = parseInt(match[1]);
        break;
      }
    }

    // Validar que se encontraron los datos básicos
    if (!nombre || casilla === 0) {
      return conn.reply(m.chat, '❌ No se pudieron extraer los datos básicos (nombre y casilla). Verifica el formato de la ficha.', m);
    }

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

    // Enviar resultado de manera simple primero
    await conn.reply(m.chat, resultado, m);

  } catch (error) {
    console.error('Error procesando ficha:', error);
    return conn.reply(m.chat, `❌ Error procesando la ficha: ${error.message}`, m);
  }
};

handler.help = ["resultados"];
handler.tags = ["torneo", "games"];
handler.command = ['resultados', 'resultado'];
handler.register = false;

export default handler;

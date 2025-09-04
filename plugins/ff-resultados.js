const handler = async (m, { conn, usedPrefix }) => {
  // Verificar si hay un mensaje citado
  if (!m.quoted) {
    return conn.reply(m.chat, '❌ Debes responder a un mensaje que contenga la ficha de resultados', m);
  }

  const fichaTexto = m.quoted.text || m.quoted.caption || '';
  
  // Verificar si es una ficha válida
  if (!fichaTexto || (!fichaTexto.includes('𝐍𝐨𝐦𝐛𝐫𝐞 𝐝𝐞𝐥 𝐞𝐪𝐮𝐢𝐩𝐨') && !fichaTexto.includes('Nombre del equipo'))) {
    return conn.reply(m.chat, '❌ El mensaje citado no contiene una ficha válida', m);
  }

  try {
    // Sistema de puntos según la imagen (TOP = posición)
    const PUNTOS_POR_POSICION = {
      1: 12, 2: 10, 3: 9, 4: 8, 5: 6, 6: 5,
      7: 4, 8: 3, 9: 2, 10: 1, 11: 0, 12: 0
    };

    // Extraer datos de la ficha
    let nombre = '';
    let posicionB = 0; // Mapa Bermuda
    let posicionP = 0; // Mapa Purgatorio  
    let posicionK = 0; // Mapa Kalahari
    let totalKills = 0;

    // Extraer nombre del equipo
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

    // Extraer posiciones de los mapas B, P, K
    const bMatch = fichaTexto.match(/🕹\|\s*𝐁\s*:\s*(\d+)/);
    const pMatch = fichaTexto.match(/🕹\|\s*𝐏\s*:\s*(\d+)/);
    const kMatch = fichaTexto.match(/🕹\|\s*𝐊\s*:\s*(\d+)/);

    if (bMatch) posicionB = parseInt(bMatch[1]);
    if (pMatch) posicionP = parseInt(pMatch[1]);
    if (kMatch) posicionK = parseInt(kMatch[1]);

    // Extraer total de kills
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

    // Validar datos básicos
    if (!nombre) {
      return conn.reply(m.chat, '❌ No se pudo extraer el nombre del equipo. Verifica el formato de la ficha.', m);
    }

    if (posicionB === 0 && posicionP === 0 && posicionK === 0) {
      return conn.reply(m.chat, '❌ No se pudieron extraer las posiciones de los mapas (B, P, K). Verifica el formato.', m);
    }

    // Calcular puntos por mapa
    const puntosB = PUNTOS_POR_POSICION[posicionB] || 0;
    const puntosP = PUNTOS_POR_POSICION[posicionP] || 0;
    const puntosK = PUNTOS_POR_POSICION[posicionK] || 0;
    
    const puntosMapa = puntosB + puntosP + puntosK;
    const puntosKills = totalKills;
    const totalPuntos = puntosMapa + puntosKills;

    // Generar resultado detallado
    const resultado = `🏆 Resultado individual de scrim
——————————————
NOMBRE: ${nombre}
CASILLA: ${posicionB > 0 ? posicionB : 'N/A'}
——————————————
Puntos de mapa: ${puntosMapa}
${posicionB > 0 ? `• Mapa B (pos ${posicionB}): ${puntosB} pts` : ''}
${posicionP > 0 ? `• Mapa P (pos ${posicionP}): ${puntosP} pts` : ''}
${posicionK > 0 ? `• Mapa K (pos ${posicionK}): ${puntosK} pts` : ''}
Puntos de kills: ${puntosKills}
Total de puntos: ${totalPuntos}
——————————————
Incumplimiento de regla
no aplica`;

    // Reaccionar al mensaje original
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // Enviar resultado
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

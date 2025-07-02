const idgroup = "120363403633171304@g.us"; // ID de tu grupo
const reports = []; // Ahora es un array, no un objeto

let handler = async (m, { conn, command, args }) => {
  if (command === 'test') {
    const contenido = args.join(' ');

    if (!contenido) {
      return conn.reply(m.chat, `🙌 Por favor, proporciona un reporte.`, m);
    }

    const senderName = await conn.getName(m.sender);
    const reportText = `👤 *Usuario:* ${senderName || 'Anónimo'}\n📝 *Reporte:* ${contenido || 'Sin descripción'}\n📱 *Número:* @${m.sender.split('@')[0]}`;

    // Enviar el reporte al grupo con mención
    const msg = await conn.sendMessage(idgroup, {
      text: `✿ Nuevo reporte:\n\n${reportText}`,
      mentions: [m.sender]
    });

    // Guardar como objeto con más datos
    reports.push({
      id: msg.key.id,
      user: m.sender,
      contenido,
      nombre: senderName,
      timestamp: Date.now()
    });

    // Confirmación al usuario
    await conn.reply(m.chat, `🙌 Tu reporte ha sido enviado al grupo para revisión.`, m);

  } else if (command === 'responder') {
    if (!m.quoted) {
      return conn.reply(m.chat, `❌ Debes citar el mensaje del reporte enviado por el bot.`, m);
    }

    const response = args.join(' ');

    if (!response) {
      return conn.reply(m.chat, `🙏 Por favor, proporciona una respuesta.`, m);
    }

    // Buscar el reporte relacionado
    const textoCitado = m.quoted?.text || "";
    const report = reports.find(r =>
      textoCitado.includes(r.contenido) &&
      textoCitado.includes(r.nombre)
    );

    if (!report) {
      return conn.reply(m.chat, `❌ No se encontró el reporte citado. Asegúrate de citar el mensaje correcto del bot.`, m);
    }

    // Enviar respuesta al usuario original
    await conn.sendMessage(report.user, {
      text: `📣 Respuesta a tu reporte:\n\n${response}`
    });

    // Confirmación en el grupo
    await conn.sendMessage(idgroup, {
      text: `❗ Respuesta enviada:\n\n🗨️ *Respuesta:* ${response}\n📋 *Reporte original:* ${report.contenido}\n👤 *Respondido por:* @${m.sender.split('@')[0]}`,
      mentions: [m.sender]
    });

    // Eliminar el reporte ya respondido
    const index = reports.indexOf(report);
    if (index > -1) reports.splice(index, 1);
  }
};

handler.command = ['test', 'responder'];
handler.tags = ['tools'];
handler.help = ['test <mensaje>', 'responder <respuesta> (citando el reporte)'];
handler.rowner = true;

export default handler;

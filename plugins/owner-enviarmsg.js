const idgroup = "120363403633171304@g.us"; // ID de tu grupo
const reports = {};

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

    // Guardar el ID del mensaje para poder responder después
    reports[msg.key.id] = {
      user: m.sender,
      contenido
    };

    // Confirmación al usuario
    await conn.reply(m.chat, `🙌 Tu reporte ha sido enviado al grupo para revisión.`, m);

  } else if (command === 'responder') {
    const quotedId = m?.quoted?.key?.id;

    if (!quotedId) {
      return conn.reply(m.chat, `❌ Debes *citar* el mensaje del reporte enviado por el bot.`, m);
    }

    const report = reports[quotedId];

    if (!report) {
      return conn.reply(m.chat, `❌ No se encontró el reporte para responder. Asegúrate de responder al *mensaje correcto del bot*.`, m);
    }

    const response = args.join(' ');

    if (!response) {
      return conn.reply(m.chat, `🙏 Por favor, proporciona una respuesta.`, m);
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

    // Eliminar de memoria si no quieres dobles respuestas
    delete reports[quotedId];
  }
};

handler.command = ['test', 'responder'];
handler.tags = ['tools'];
handler.help = ['test <mensaje>', 'responder <respuesta> (citando el reporte)'];
handler.rowner = true;

export default handler;

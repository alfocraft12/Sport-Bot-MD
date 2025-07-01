const idgroup = "120363403633171304@g.us"; // Reemplaza con el ID real de tu grupo
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

    // Guardar el ID para futuras respuestas
    reports[msg.key.id] = {
      user: m.sender,
      contenido
    };

    // Confirmación al usuario
    await conn.reply(m.chat, `🙌 Tu reporte ha sido enviado al grupo para revisión.`, m);

  } else if (command === 'responder') {
    if (!m.quoted || !reports[m.quoted.key.id]) {
      return conn.reply(m.chat, `❌ No se encontró el reporte para responder.`, m);
    }

    const response = args.join(' ');

    if (!response) {
      return conn.reply(m.chat, `🙏 Por favor, proporciona una respuesta.`, m);
    }

    const report = reports[m.quoted.key.id];

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
    delete reports[m.quoted.key.id];
  }
};

handler.command = ['test', 'responder'];
handler.tags = ['tools'];
handler.help = ['test <mensaje>', 'responder <respuesta> (citando el reporte)'];
handler.rowner = true;

export default handler;

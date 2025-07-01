const idchannel = "120363402702484902@newsletter"; // ID de tu canal
const reports = {};

let handler = async (m, { conn, command, args }) => {
  if (command === 'test') {
    const contenido = args.join(' ');

    if (!contenido) {
      return conn.reply(m.chat, `🙌 Por favor, proporciona un reporte.`, m);
    }

    const senderName = await conn.getName(m.sender);
    const reportText = `👤 *Usuario:* ${senderName || 'Anónimo'}\n📝 *Reporte:* ${contenido || 'Sin descripción'}\n📱 *Número:* @${m.sender.split('@')[0]}`;

    const msg = await conn.sendMessage(idchannel, { text: `✿ Nuevo reporte:\n\n${reportText}` });

    // Guardar referencia del mensaje en caso de respuesta
    reports[msg.key.id] = {
      user: m.sender,
      contenido
    }

    await conn.reply(m.chat, `🙌 Tu reporte ha sido enviado al canal para revisión.`, m);

  } else if (command === 'responder') {
    if (!m.quoted || !reports[m.quoted.key.id]) {
      return conn.reply(m.chat, `❌ No se encontró el reporte para responder.`, m);
    }

    const response = args.join(' ');

    if (!response) {
      return conn.reply(m.chat, `🙏 Por favor, proporciona una respuesta.`, m);
    }

    const report = reports[m.quoted.key.id];
    await conn.reply(report.user, `📣 Respuesta a tu reporte: ${response}`, null);

    await conn.sendMessage(idchannel, {
      text: `❗ Respuesta enviada:\n\n🗨️ *Respuesta:* ${response}\n📋 *Reporte original:* ${report.contenido}\n👤 *Respondido por:* @${m.sender.split('@')[0]}`
    });
  }
}

handler.command = ['test', 'responder'];
export default handler;

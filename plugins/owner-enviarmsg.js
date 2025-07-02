const idgroup = "120363403633171304@g.us";
const reports = [];
let ticketCounter = 1; // Empieza desde el ticket #1

function formatDate() {
  const now = new Date();
  return now.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

let handler = async (m, { conn, command, args }) => {
  if (command === 'test') {
    const contenido = args.join(' ');

    if (!contenido) {
      return conn.reply(m.chat, `🙌 Por favor, proporciona un reporte.`, m);
    }

    const senderName = await conn.getName(m.sender);
    const ticketId = `#${ticketCounter.toString().padStart(4, '0')}`; // Ej: #0001

    const reportText = `🆔 *Ticket:* ${ticketId}\n👤 *Usuario:* ${senderName || 'Anónimo'}\n📝 *Reporte:* ${contenido || 'Sin descripción'}\n📱 *Número:* @${m.sender.split('@')[0]}`;

    const msg = await conn.sendMessage(idgroup, {
      text: `✿ Nuevo reporte:\n\n${reportText}\n━━━━━━━━━━━━━━\n🕒 *Enviado:* ${formatDate()}`,
      mentions: [m.sender]
    });

    reports.push({
      id: msg.key.id,
      user: m.sender,
      contenido,
      nombre: senderName,
      ticket: ticketId,
      timestamp: Date.now()
    });

    ticketCounter++;

    await conn.reply(m.chat, `🙌 Tu reporte fue enviado al grupo con el ${ticketId}.`, m);

  } else if (command === 'responder') {
    if (!m.quoted) {
      return conn.reply(m.chat, `❌ Debes citar el mensaje del reporte enviado por el bot.`, m);
    }

    const response = args.join(' ');

    if (!response) {
      return conn.reply(m.chat, `🙏 Por favor, proporciona una respuesta.`, m);
    }

    const textoCitado = m.quoted?.text || "";
    const report = reports.find(r =>
      textoCitado.includes(r.contenido) &&
      textoCitado.includes(r.nombre)
    );

    if (!report) {
      return conn.reply(m.chat, `❌ No se encontró el reporte citado. Asegúrate de citar el mensaje correcto del bot.`, m);
    }

    const mensajeFinal = `❗ *Respuesta enviada:*\n🆔 *Ticket:* ${report.ticket}\n━━━━━━━━━━━━━━\n🗨️ *Respuesta:* ${response}\n📋 *Reporte original:* ${report.contenido}\n👤 *Respondido por:* @${m.sender.split('@')[0]}\n━━━━━━━━━━━━━━\n🕒 *Respondido:* ${formatDate()}`;

    await conn.sendMessage(report.user, { text: mensajeFinal });

    await conn.sendMessage(idgroup, {
      text: mensajeFinal,
      mentions: [m.sender]
    });

    const index = reports.indexOf(report);
    if (index > -1) reports.splice(index, 1);
  }
};

handler.command = ['test', 'responder'];
handler.tags = ['tools'];
handler.help = ['test <mensaje>', 'responder <respuesta> (citando el reporte)'];
handler.rowner = true;

export default handler;

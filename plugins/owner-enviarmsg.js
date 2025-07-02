import fs from 'fs'
const idgroup = "120363403633171304@g.us"
const reportes = []
const ticketFile = './media/database/tickets.json'

// Asegura que exista la carpeta
if (!fs.existsSync('./media/database')) fs.mkdirSync('./media/database', { recursive: true })

// Leer ticket actual
function getTicketCounter() {
  try {
    if (!fs.existsSync(ticketFile)) fs.writeFileSync(ticketFile, JSON.stringify({ counter: 1 }, null, 2))
    const data = JSON.parse(fs.readFileSync(ticketFile))
    return data.counter || 1
  } catch {
    return 1
  }
}

// Guardar nuevo valor
function updateTicketCounter(nuevoValor) {
  fs.writeFileSync(ticketFile, JSON.stringify({ counter: nuevoValor }, null, 2))
}

// Formato de fecha
function formatDate() {
  const now = new Date()
  return now.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

let handler = async (m, { conn, command, args }) => {
  if (command === 'test') {
    const contenido = args.join(' ')
    if (!contenido) return conn.reply(m.chat, `🙌 Por favor, proporciona un reporte.`, m)

    const senderName = await conn.getName(m.sender)
    const ticketNum = getTicketCounter()
    const ticketId = `#${ticketNum.toString().padStart(4, '0')}`

    const reportText = `🆔 *Ticket:* ${ticketId}\n👤 *Usuario:* ${senderName}\n📝 *Reporte:* ${contenido}\n📱 *Número:* @${m.sender.split('@')[0]}`

    const msg = await conn.sendMessage(idgroup, {
      text: `✿ Nuevo reporte:\n\n${reportText}\n━━━━━━━━━━━━━━\n🕒 *Enviado:* ${formatDate()}`,
      mentions: [m.sender]
    })

    reportes.push({
      id: msg.key.id,
      user: m.sender,
      contenido,
      nombre: senderName,
      ticket: ticketId,
      timestamp: Date.now()
    })

    updateTicketCounter(ticketNum + 1)

    // ✅ Confirmación para el usuario
    await conn.sendMessage(m.sender, {
      text: `🙌 *Tu reporte fue enviado correctamente.*\n🆔 *Ticket:* ${ticketId}\n🕒 *Enviado:* ${formatDate()}`
    })

  } else if (command === 'responder') {
    if (!m.quoted) return conn.reply(m.chat, `❌ Debes citar el mensaje del reporte enviado por el bot.`, m)

    const respuesta = args.join(' ')
    if (!respuesta) return conn.reply(m.chat, `🙏 Por favor, proporciona una respuesta.`, m)

    const textoCitado = m.quoted.text || ""
    const reporte = reportes.find(r =>
      textoCitado.includes(r.contenido) &&
      textoCitado.includes(r.nombre)
    )

    if (!reporte) return conn.reply(m.chat, `❌ No se encontró el reporte citado.`, m)

    const mensajeFinal = `❗ *Respuesta enviada:*\n🆔 *Ticket:* ${reporte.ticket}\n━━━━━━━━━━━━━━\n🗨️ *Respuesta:* ${respuesta}\n📋 *Reporte original:* ${reporte.contenido}\n👤 *Respondido por:* @${m.sender.split('@')[0]}\n━━━━━━━━━━━━━━\n🕒 *Respondido:* ${formatDate()}`

    await conn.sendMessage(reporte.user, {
      text: mensajeFinal,
      mentions: [m.sender]
    })

    await conn.sendMessage(idgroup, {
      text: mensajeFinal,
      mentions: [m.sender]
    })

    const index = reportes.indexOf(reporte)
    if (index > -1) reportes.splice(index, 1)
  }
}

handler.command = ['test', 'responder']
handler.tags = ['tools']
handler.help = ['test <mensaje>', 'responder <respuesta> (citando el reporte)']
handler.rowner = true

export default handler

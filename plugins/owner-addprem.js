const handler = async (m, {conn, text, usedPrefix, command}) => {
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
  else who = m.chat;
  const textpremERROR = `🚩 Ingrese el tag del usuario que quieras agregar como user premium`;
  if (!who) return m.reply(textpremERROR, null, {mentions: conn.parseMention(textpremERROR)});

  const user = global.db.data.users[who];
  const txt = text.replace('@' + who.split`@`[0], '').trim();
  const name = '@' + who.split`@`[0];

  const ERROR = `🚩 Ese usuario no está en mi base de datos!`;
  if (!user) return m.reply(ERROR, null, {mentions: conn.parseMention(ERROR)});

  if (isNaN(txt) || !txt) {
    return m.reply(`🚩 Debes indicar un número válido de tiempo`, null, {mentions: [who]});
  }

  const horas = 60 * 60 * 1000;
  const dias = 24 * horas;
  const semanas = 7 * dias;
  const meses = 30 * dias;
  const now = Date.now();

  if (command == 'addprem' || command == 'userpremium') {
    if (now < user.premiumTime) user.premiumTime += horas * txt;
    else user.premiumTime = now + horas * txt;
    const timeLeft = (user.premiumTime - now) / 1000;
    const textprem1 = `*🎟️ Nuevo Usuario Premium!!!*\n\n*✨ User: ${name}*\n*🕐 Tiempo: ${txt} hora(s)*\n*📉 Restante: ${timeLeft.toFixed(0)} segundos*`;
    m.reply(textprem1, null, {mentions: conn.parseMention(textprem1)});
  }

  if (command == 'addprem2' || command == 'userpremium2') {
    if (now < user.premiumTime) user.premiumTime += dias * txt;
    else user.premiumTime = now + dias * txt;
    const timeLeft = (user.premiumTime - now) / 1000 / 60 / 60;
    const textprem2 = `*🎟️ Nuevo Usuario Premium!!!*\n\n*✨ User: ${name}*\n*🕐 Tiempo: ${txt} día(s)*\n*📉 Restante: ${timeLeft.toFixed(1)} horas*`;
    m.reply(textprem2, null, {mentions: conn.parseMention(textprem2)});
  }

  if (command == 'addprem3' || command == 'userpremium3') {
    if (now < user.premiumTime) user.premiumTime += semanas * txt;
    else user.premiumTime = now + semanas * txt;
    const timeleft = await formatTime(user.premiumTime - now);
    const textprem3 = `*🎟️ Nuevo Usuario Premium!!!*\n\n*✨ User: ${name}*\n*🕐 Tiempo: ${txt} semana(s)*\n*📉 Restante: ${timeleft}*`;
    m.reply(textprem3, null, {mentions: conn.parseMention(textprem3)});
  }

  if (command == 'addprem4' || command == 'userpremium4') {
    if (now < user.premiumTime) user.premiumTime += meses * txt;
    else user.premiumTime = now + meses * txt;
    const timeleft = await formatTime(user.premiumTime - now);
    const textprem4 = `*🎟️ Nuevo Usuario Premium!!!*\n\n*✨ Usuario: ${name}*\n*🕐 Tiempo: ${txt} mes(es)*\n*📉 Restante: ${timeleft}*`;
    m.reply(textprem4, null, {mentions: conn.parseMention(textprem4)});
  }

  user.premium = true;
  if (global.db?.write) await global.db.write(); // 🧠 Guardar cambios en disco
};

handler.help = ['addprem [@user] <horas>'];
handler.tags = ['owner'];
handler.command = ['addprem', 'userpremium', 'addprem2', 'userpremium2', 'addprem3', 'userpremium3', 'addprem4', 'userpremium4'];
handler.group = true;
handler.rowner = true;
export default handler;

async function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  let timeString = '';
  if (days) timeString += `${days} día${days > 1 ? 's' : ''} `;
  if (hours) timeString += `${hours} hora${hours > 1 ? 's' : ''} `;
  if (minutes) timeString += `${minutes} minuto${minutes > 1 ? 's' : ''} `;
  if (seconds) timeString += `${seconds} segundo${seconds > 1 ? 's' : ''} `;
  return timeString.trim();
}

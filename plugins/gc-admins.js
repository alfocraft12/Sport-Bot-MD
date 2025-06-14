const handler = async (m, { conn, participants, groupMetadata, args }) => {
  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  const pesan = args.join` `;
  const oi = `» ${pesan}`;
  const text = `🏆 Invocando a los Admins:  
  
${listAdmin}

🍭 Mensaje adicional: ${oi}

『✦』Levantense nojoda y vayas a trabajar cuerda de bagos.`.trim();

  await conn.sendMessage(
    m.chat,
    {
      text,
      mentions: [...groupAdmins.map((v) => v.id), owner]
    },
    { quoted: m }
  );
};

handler.help = ['admins <texto>'];
handler.tags = ['grupo'];
handler.customPrefix = /a|@/i;
handler.command = /^(admins|@admins|dmins)$/i;
handler.group = true;

export default handler;

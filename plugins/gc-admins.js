const handler = async (m, {conn, participants, groupMetadata, args}) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || '';
  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  const pesan = args.join` `;
  const oi = `» ${pesan}`;
  const text = `🏆 Invocando a los admins Admins:  
  
${listAdmin}

🍭 Mensaje adicional: ${oi}

『✦』Levantense nojoda y vayas a trabajar cuerda de bagos.`.trim();
  conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]});
};
handler.help = ['admins <texto>'];
handler.tags = ['grupo'];
handler.customPrefix = /a|@/i;
handler.command =  ['admins <texto>', 'lideres <texto>'];
handler.group = true;
export default handler;

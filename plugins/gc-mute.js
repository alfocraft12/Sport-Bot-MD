/** By @MoonContentCreator || https://github.com/MoonContentCreator/BixbyBot-Md **/
import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin }) => {
  if (command === 'mute') {
    if (!isAdmin) throw '💌 *Solo un administrador puede ejecutar este comando*';

    const ownerJid = global.owner[0][0] + '@s.whatsapp.net';
    if (m.mentionedJid[0] === ownerJid) throw '👑 *El creador del bot no puede ser muteado*';

    let target =
      m.mentionedJid[0] ||
      (m.quoted ? m.quoted.sender : text);
    if (target === conn.user.jid) throw '🚩 *No puedes mutar el bot*';

    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';
    if (target === groupOwner) throw '👑 *No puedes mutar el creador del grupo*';

    const isOwner = global.owner.some(([num]) => target.includes(num));
    if (isOwner) throw '👑 *No puedes mutear a un propietario del bot*';

    let userData = global.db.data.users[target];
    if (userData.mute) throw '🚩 *Este usuario ya ha sido muteado*';

    const fakeContact = {
      key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
      message: {
        locationMessage: {
          name: 'Usuario muteado',
          jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
          vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
        }
      },
      participant: '0@s.whatsapp.net'
    };

    if (!m.mentionedJid[0] && !m.quoted)
      return conn.reply(m.chat, '💥 *Menciona a la persona que deseas mutar*', m);

    conn.reply(m.chat, '✨️ *Tus mensajes serán eliminados*', fakeContact, null, { mentions: [target] });
    userData.mute = true;
  }

  if (command === 'unmute') {
    if (!isAdmin) throw '💭 *Solo un administrador puede ejecutar este comando*';

    let target =
      m.mentionedJid[0] ||
      (m.quoted ? m.quoted.sender : text);

    if (target === m.sender) throw '✨️ *Sólo otro administrador puede desmutarte*';

    let userData = global.db.data.users[target];

    const fakeContact = {
      key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
      message: {
        locationMessage: {
          name: 'Usuario desmuteado',
          jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
          vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
        }
      },
      participant: '0@s.whatsapp.net'
    };

    if (!m.mentionedJid[0] && !m.quoted)
      return conn.reply(m.chat, '💥 *Menciona a la persona que deseas demutar*', m);

    if (!userData.mute) throw '☁️ *Este usuario no ha sido muteado*';

    userData.mute = false;
    conn.reply(m.chat, '*Tus mensajes no serán eliminados*', fakeContact, null, { mentions: [target] });
  }
};

handler.command = ['mute', 'unmute'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

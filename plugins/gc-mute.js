const handler = async (_0x5b04ea, { conn: _0x24d45b, command: _0x38ad25, text: _0x29b0ac, isAdmin: _0x9e35ac }) => {
  const _ = _0x1e46;

  if (_0x38ad25 === _('139')) {
    if (!_0x9e35ac) throw '💌 *Solo un administrador puede ejecutar este comando*';

    const mentionedJid = _0x5b04ea.mentionedJid?.[0] || _0x5b04ea.quoted?.sender || _0x29b0ac;
    if (!mentionedJid) return _0x24d45b.reply(_0x5b04ea.chat, _('14a'), _0x5b04ea);

    const isOwner = global.owner.some(([num]) => mentionedJid.includes(num));
    if (isOwner) throw '👑 *No puedes mutear a un propietario del bot*';

    const metadata = await _0x24d45b.groupMetadata(_0x5b04ea.chat);
    const botJid = _0x24d45b.user.jid;
    const groupCreator = metadata.owner || _0x5b04ea.chat.split('-')[0] + '@s.whatsapp.net';
    if (mentionedJid === botJid) throw _('144');
    if (mentionedJid === groupCreator) throw _('14f');

    const userData = global.db.data.users[mentionedJid];
    if (userData.mute) throw _('14d');

    const fkontak = {
      key: { participants: _('146'), fromMe: false, id: _('13b') },
      message: {
        locationMessage: {
          name: _('13c'),
          jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
          vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Unlimited\nORG:Unlimited\nEND:VCARD'
        }
      },
      participant: _('146')
    };

    _0x24d45b.reply(_0x5b04ea.chat, _('137'), fkontak, null, { mentions: [mentionedJid] });
    userData.mute = true;
  }

  if (_0x38ad25 === _('147')) {
    if (!_0x9e35ac) throw '💌 *Solo un administrador puede ejecutar este comando*';

    const mentionedJid = _0x5b04ea.mentionedJid?.[0] || _0x5b04ea.quoted?.sender || _0x29b0ac;
    if (!mentionedJid) return _0x24d45b.reply(_0x5b04ea.chat, _('13f'), _0x5b04ea);

    const userData = global.db.data.users[mentionedJid];
    if (!userData.mute) throw _('149');

    const fkontak = {
      key: { participants: _('146'), fromMe: false, id: _('13b') },
      message: {
        locationMessage: {
          name: _('143'),
          jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
          vcard: _('138')
        }
      },
      participant: _('146')
    };

    _0x24d45b.reply(_0x5b04ea.chat, '*Tus mensajes no serán eliminados*', fkontak, null, { mentions: [mentionedJid] });
    userData.mute = false;
  }
};

handler.command = ['mute', 'unmute'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;

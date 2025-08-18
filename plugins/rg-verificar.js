import fetch from "node-fetch";
import PhoneNumber from 'awesome-phonenumber';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
try {
const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;
let old = performance.now();

let senderNumber = m.sender.replace('@s.whatsapp.net', '');
let numeroLimpio = '+' + senderNumber;
let pn = new PhoneNumber(numeroLimpio);

let mundo = 'Desconocido 🌍';
if (pn.isValid()) {
  try {
    let delirius = await axios.get(`https://delirius-apiofc.vercel.app/tools/country?text=${encodeURIComponent(pn.getNumber('international'))}`);
    let paisdata = delirius?.data?.result;
    mundo = paisdata ? `${paisdata.name} ${paisdata.emoji}` : 'Desconocido 🌍';
  } catch (e) {
    console.error('Error consultando país:', e.message);
    mundo = 'Desconocido 🌍';
  }
}

let name = await conn.getName(m.sender);
let avatar = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340b3df2c.png');
let fileSize = (await (await fetch(avatar)).blob()).size || 0;
let timestamp = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
let timeTaken = (performance.now() - old).toFixed(3);

let response = `╭━━━[ *𝑽𝑬𝑹𝑰𝑭𝑰𝑪𝑨𝑪𝑰Ó𝑵* ]━━━⬣
┃ *🤴 Usuario:* ${name} wa.me/${senderNumber}
┃ *🌍 País:* ${mundo}
┃ *🧬 Número:* ${pn.getNumber('international')}
┃ *📁 Foto:* ${(fileSize / 1024).toFixed(2)} KB
┃ *🕒 Fecha:* ${timestamp}
┃ *⚡ Ping:* ${timeTaken} ms
╰━━━━━━[ *Whatsapp plus* ]━━━━━━⬣`;

let buttonMessage = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
  viewOnceMessage: {
    message: {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2
      },
      interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({
          text: response
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: "Whatsapp plus ✅"
        }),
        header: proto.Message.InteractiveMessage.Header.create({
          title: "",
          subtitle: "",
          hasMediaAttachment: false
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [{
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🌐 Instagram",
              url: "https://www.instagram.com/alfonsograterolpow/",
              merchant_url: "https://www.instagram.com/alfonsograterolpow/"
            })
          }]
        })
      })
    }
  }
}), { userJid: m.sender, quoted: m });

await conn.relayMessage(m.chat, buttonMessage.message, { messageId: buttonMessage.key.id });

} catch (e) {
console.error(e);
m.reply("❌ Hubo un error en la verificación, intenta de nuevo.");
}
};

handler.help = ['verificar']
handler.tags = ['xp']
handler.command = /^(reg|Reg)$/i

export default handler;

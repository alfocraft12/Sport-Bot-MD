import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } from '@whiskeysockets/baileys';
import pino from 'pino';

// Definición del prefijo global
global.prefix = /[!#\/.]/;  // Puedes definir múltiples prefijos usando expresión regular

export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) return;

  let perfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg');
  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true;
      }
    }
    return false;
  };

  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    if (chat?.isBanned) return;
    if (!user.commands) user.commands = 0;
    user.commands += 1;

    let chtxt = `
👤 *Usuario* » ${m.pushName || 'Incógnito'}
⭐️ *Comando utilizado* » ${command}

> Recuerda que si haces mucho spam de comando puedes ser baneado. 🍁💫
    `.trim();

    const idgroup = "120363403633171304@g.us"; // 💬 GRUPO en lugar de canal

    await conn.sendMessage(idgroup, {
      text: chtxt,
      contextInfo: {
        externalAdReply: {
          title: "【 🔔 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎́𝐍 🔔 】",
          body: '🥳 ¡Un usuario ha usado un comando!',
          thumbnailUrl: perfil,
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: null });

  } else {
    // const comando = m.text.trim().split(' ')[0];
    // await m.reply(`⚡︎ El comando *${comando}* no existe.\nPara ver la lista de comandos usa:\n» *#help*`);
  }
}

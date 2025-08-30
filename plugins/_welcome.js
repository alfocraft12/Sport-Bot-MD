if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let bienvenida = `┏╼★${textbot}\n┋「 Bienvenido 」\n┗╼★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n ┋❖ ${welcomeMessage}\n ┋❀  ${groupMetadata.subject}\n ┗━━━━━━━━━━━━━━━┅ ⳹\n> espero la pases bien mi amigo`
    await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })
} else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    const despMessage = global.db.data.chats[m.chat]?.despMessage || 'Se Fue😹';
    let bye = `┏╼★${textbot}\n┋「 ADIOS 👋 」\n┗╼★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n ┋❖ ${despMessage}\n ┋❀ Jamás te quisimos aquí\n ┗━━━━━━━━━━━━━━━┅ ⳹\n> ♪DcA Alfo♪`
    await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [who] })
}

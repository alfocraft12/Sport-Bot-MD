const handler = async (m, { conn, usedPrefix, args, text, isAdmin, isBotAdmin }) => {
  // Verificar si el usuario es administrador del grupo
  if (!isAdmin) {
    return conn.reply(m.chat, '❌ Solo los administradores del grupo pueden usar este comando.', m);
  }

  try {
    // ============ AQUÍ VA EL MENSAJE DEL ANUNCIO ============
    const mensajeDevocional = `esta es una prueba alfo`;
    
    // Hora proporcionada por el usuario (opcional)
    const hora = text ? text.trim() : '8:30 PM';

    // Generar link único de Google Meet
    const generarLinkMeet = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      const nums = '0123456789';
      
      const randomString = (length, chars) => {
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const part1 = randomString(3, chars);
      const part2 = randomString(4, chars + nums);
      const part3 = randomString(3, chars);
      
      return `https://meet.google.com/${part1}-${part2}-${part3}`;
    };

    // Generar el link único
    const linkDevocional = generarLinkMeet();

    // Crear el mensaje completo del anuncio
    let anuncioCompleto = `${mensajeDevocional}

——————————————
*🔗 Link de acceso:*
${linkDevocional}

*⏰ Hora:* ${hora}
——————————————
*📱 Anunciado por:* @${m.sender.split('@')[0]}`;

    // Reaccionar al mensaje del comando
    await conn.sendMessage(m.chat, { react: { text: '🙏', key: m.key } });

    // ============ AQUÍ PONES LA RUTA DE TU IMAGEN ============
    const rutaImagen = './src/kertas/devocionales.jpg';
    // ========================================================

    try {
      // Enviar imagen con el anuncio
      await conn.sendMessage(m.chat, {
        image: { url: rutaImagen }, // Si es archivo local usa: fs.readFileSync(rutaImagen)
        caption: anuncioCompleto,
        mentions: [m.sender]
      }, { quoted: m });

    } catch (imgError) {
      console.log('Error cargando imagen:', imgError);
      // Si falla la imagen, enviar solo el texto
      await conn.reply(m.chat, anuncioCompleto + '\n\n⚠️ *Nota:* Imagen no disponible.', m, { 
        mentions: [m.sender] 
      });
    }

  } catch (error) {
    console.error('Error en comando devocional:', error);
    return conn.reply(m.chat, `❌ Error creando el anuncio del devocional: ${error.message}`, m);
  }
};

handler.help = ["devocional"];
handler.tags = ["grupo", "admin"];
handler.command = ['devocional'];
handler.admin = true; // Solo administradores
handler.group = true; // Solo en grupos
handler.register = false;

export default handler;

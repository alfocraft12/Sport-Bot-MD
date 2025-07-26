import { promises as fs } from 'fs'
import path from 'path'

var handler = async (m, { conn }) => {
  const userTag = '@' + m.sender.split('@')[0] // 👈 Mencionamos al usuario por tag

  const mensaje = `
Bienvenido ${userTag} 👋🏻, este es el menu de comandos que tengo disponible hasta el momento, espero te agrade 😍



〔 🏆Sport-Bot-MD 🏆〕

╭━〔 Menús 〕⬣
┃💻➺ .comandos
┃💻➺ .comands
┃💻➺ .menuff (mantenimiento)
┃💻➺ .menugrupo (detallado e inhabilitado)
┃💻➺ .on|enable
┃💻➺ .off|disable
┃💻➺ .owner
╰━━━━━━━━━━━⬣

╭━〔COMANDOS〕━⬣
┃.comands 
┃ .comandos
┃.reg
┃.unreg
╰━━━━━━━━━━━⬣

╭━〔 FUNCION VS / REGLAS / FICHA〕━⬣
┃🍬➺ .reglascrim
┃🍬➺ .reglasclk
┃🍬➺ .gdc
┃🍬➺ .Ficha / jugador (inhabilitado)
┃🍬➺ .bermuda| ver
┃🍬➺ .kalahari| kal
┃🍬➺ .purgatorio| pur
╰━━━━━━━━━━━━⬣


╭━〔 SPAM Y EDITS 〕⬣
┃👤➺ .Spamwa 
╰━━━━━━━━━━━⬣

╭━〔 IA 〕⬣
┃🛜➺ .IA
┃🛜➺ .chatgpt
┃🛜➺ .Sport-Bot
┃🛜➺ .gemini
┃🛜➺ .bard
┃🛜➺ .iagrosera
┃🛜➺ .brut
╰━━━━━━━━━━━⬣

╭━ MULTI JUEGOS ━⬣
┃🎮➺ .Abrazo
┃🎮➺ .Cumple
┃🎮➺ .Follar
┃🎮➺ .Huevo
┃🎮➺ .Formartrio
┃🎮➺ .Sorteo
┃🎮➺ .Nalga
┃🎮➺ .Sega
┃🎮➺ _.math |matemáticas
┃🎮➺ _.lanzar cara | cruz
┃🎮➺ .ppt piedra : papel : tijera
┃🎮➺ .tictactoe | ttt sala
┃🎮➺ .deltictactoe | delttt
┃🎮➺ .topgays
┃🎮➺ .topotakus
┃🎮➺ .toppajer@s
┃🎮➺ .topput@s
┃🎮➺ .topintegrantes
┃🎮➺ .toplagrasa | topgrasa
┃🎮➺ .toppanafrescos
┃🎮➺ .topshiposters
┃🎮➺ .toplindos | toplind@s
┃🎮➺ .topfamosos/@s
┃🎮➺ .topparejas
┃🎮➺ .gay | gay @tag
┃🎮➺ .gay2 nombre : @tag
┃🎮➺ .lesbiana nombre : @tag
┃🎮➺ .manca nombre : @tag
┃🎮➺ .manco nombre : @tag
┃🎮➺ .pajero nombre : @tag
┃🎮➺ .pajera nombre : @tag
┃🎮➺ .puto nombre : @tag
┃🎮➺ .puta nombre : @tag
┃🎮➺ .rata nombre : @tag
┃🎮➺ .love nombre : @tag
┃🎮➺ .doxear nombre : @tag
┃🎮➺ .doxxeame
┃🎮➺ .pregunta texto
┃🎮➺ .apostar | slot cantidad
┃🎮➺ .formarpareja
┃🎮➺ .dado
┃🎮➺ .verdad
┃🎮➺ .reto
┃🎮➺ .anuel
┃🎮➺ .ferxxo
╰━━━━━━━━━━━⬣

╭━━━[ AJUSTES - CHATS ]━━━⬣
┃⚙ .on : off  bienvenida
┃⚙ .on : off avisos
┃⚙ .on : off restringir
┃⚙ .on : off antillamar
┃⚙ .on : off publico
┃⚙ .on : off autovisto
┃⚙ .on : off temporal
┃⚙ .on : off NSFC
┃⚙ .on : off antitoxicos
┃⚙ .on : off antiver
┃⚙ .on : off antidelete
┃⚙ .on : off antinternacional
┃⚙ .on : off antienlace
┃⚙ .on : off antienlace2
┃⚙ .on : off antitiktok
┃⚙ .on : off antiyoutube
┃⚙ .on : off soloprivados
┃⚙ .on : off sologrupos
╰━━━━━━━━━━━━⬣

╭━〔 GRUPO - RESUMEN 〕━⬣
┃🧾➺ .configuracion
┃🧾➺ .settings
┃🧾➺ .vergrupo
| 🧾➺ .infogc
╰━━━━━━━━━━━⬣

╭━[ DESCARGAS | DOWNLOADS ]━⬣
┃🍭➺ .imagen | image texto
┃🍭➺ .pinterest | dlpinterest texto
┃🍭➺ .wallpaper|wp texto
┃🍭➺ .play | play2 texto link
┃🍭➺ .tw |twdl | twitter link
┃🍭➺ .facebook | fb link
┃🍭➺ .verig | igstalk usuario(a)
┃🍭➺ .ighistoria | igstory usuario(a)
┃🍭➺ .tiktok link
┃🍭➺ .tiktokimagen | ttimagen link
┃🍭➺ .tiktokfoto | tiktokphoto usuario(a)
┃🍭➺ .vertiktok | tiktokstalk usuario(a)
┃🍭➺ .mediafire | dlmediafire link
┃🍭➺ .clonarepo | gitclone link
┃🍭➺ .consejo
┃🍭➺ .morse codificar texto
┃🍭➺ .morse decodificar morse
┃🍭➺ .fraseromantica
┃🍭➺ .historia
╰━━━━━━━━━━━⬣

╭━[ CHAT ANONIMO (categoría en mantenimiento)]━⬣
┃👤➺ .chatanonimo | anonimochat
┃👤➺ .anonimoch
┃👤➺ .start
┃👤➺ .next
┃👤➺ .leave
╰━━━━━━━━━━━⬣

╭━[ CONFIGURACIÓN - GRUPOS ]━⬣
┃📩➺ .add
┃📩➺ .ban | kick  @tag
┃📩➺ .grupo abrir : cerrar
┃📩➺ .group open : close
┃📩➺ .daradmin | promote @tag
┃📩➺ .quitar | demote @tag
┃📩➺ .banchat
┃📩➺ .unbanchat
┃📩➺ .banuser @tag
┃📩➺ .unbanuser @tag
┃📩➺ .admins
┃📩➺ .todos
┃📩➺ .invocar
┃📩➺ .n texto
┃📩➺ .infogrupo | infogroup
┃📩➺ .grupotiempo | grouptime Cantidad
┃📩➺ .advertencia @tag
┃📩➺ .deladvertencia @tag
┃📩➺ .delwarn @tag
┃📩➺ .enlace | link
┃📩➺ .newnombre | nuevonombre texto
┃📩➺ .newdesc | descripcion texto
┃📩➺ .setwelcome | bienvenida texto (inhabilitado)
┃📩➺ .setbye | despedida texto (inhabilitado)
┃📩➺ .nuevoenlace | resetlink
┃📩➺ .on
┃📩➺ .off
╰━━━━━━━━━━━⬣


╭━[ CONVERTIDORES ]━⬣
┃👀➺ .toimg | img | jpg sticker
┃👀➺ .toanime | jadianime foto
┃👀➺ .tomp3 | mp3 video o nota de voz
┃👀➺ .tovn | vn video o audio
┃👀➺ .tovideo audio
┃👀➺ .tourl video, imagen
┃👀➺ .toenlace  video, imagen o audio
┃👀➺ .tts es texto
┃👀➺ .veraudio 
┃👀➺ .verfoto
┃👀➺ .vervideo
╰━━━━━━━━━━━⬣


╭━[ RANDOM | ANIME ]━⬣
┃🧩 .chico
┃🧩 .cristianoronaldo
┃🧩 .meme
┃🧩 .meme2
┃🧩 .itzy
┃🧩 .blackpink
┃🧩 .kpop blackpink : exo : bts
┃🧩 .lolivid
┃🧩 .loli
┃🧩 .navidad
┃🧩 .ppcouple
┃🧩 .neko
┃🧩 .waifu
┃🧩 .akira
┃🧩 .akiyama
┃🧩 .anna
┃🧩 .asuna
┃🧩 .ayuzawa
┃🧩 .boruto
┃🧩 .chiho
┃🧩 .chitoge
┃🧩 .deidara
┃🧩 .erza
┃🧩 .elaina
┃🧩 .eba
┃🧩 .emilia
┃🧩 .hestia
┃🧩 .hinata
┃🧩 .inori
┃🧩 .isuzu
┃🧩 .itachi
┃🧩 .itori
┃🧩 .kaga
┃🧩 .kagura
┃🧩 .kaori
┃🧩 .keneki
┃🧩 .kotori
┃🧩 .kurumi
┃🧩 .madara
┃🧩 .mikasa
┃🧩 .miku
┃🧩 .minato
┃🧩 .naruto
┃🧩 .nezuko
┃🧩 .sagiri
┃🧩 .sasuke
┃🧩 .sakura
┃🧩 .cosplay
╰━━━━━━━━━━━⬣

╭━[ MODIFICAR AUDIO]⬣
┃🧰 .bass
┃🧰 .blown
┃🧰 .deep
┃🧰 .earrape
┃🧰 .fast
┃🧰 .fat
┃🧰 .nightcore
┃🧰 .reverse
┃🧰 .robot
┃🧰 .slow
┃🧰 .smooth
┃🧰 .tupai
╰━━━━━━━━━━━⬣

╭━━[ BÚSQUEDAS🔍]━⬣
┃🔍➺ .animeinfo texto
┃🔍➺ .mangainfo texto
┃🔍➺ .google texto
┃🔍➺ .googlelyrics texto
┃🔍➺ .letra | lirik texto
┃🔍➺ .ytsearch | yts texto
┃🔍➺ .wiki | wikipedia texto
╰━━━━━━━━━━━⬣

╭━[ HERRAMIENTAS ]━⬣
┃⚒ .afk motivo
┃⚒ .acortar url
┃⚒ .calc operacion math
┃⚒ .del respondre a mensaje del Bot
┃⚒ .qrcode texto
┃⚒ .readmore texto1|texto2
┃⚒ .spamwa numero|texto|cantidad
┃⚒ .styletext texto
┃⚒ .traducir texto
┃⚒ .morse codificar texto
┃⚒ .morse decodificar morse
┃⚒ .encuesta | poll Motivo
┃⚒ .horario
╰━━━━━━━━━━━⬣

╭━[ FUNCIÓN RPG ]━⬣
┃🕹➺ .pase premium
┃🕹➺ .pass premium
┃🕹➺ .listapremium | listprem
┃🕹➺ .transfer tipo cantidad @tag
┃🕹➺ .dar tipo cantidad @tag
┃🕹➺ .enviar tipo cantidad @tag
┃🕹➺ .balance
┃🕹➺ .cartera | wallet
┃🕹➺ .experiencia | exp
┃🕹➺ .top | lb | leaderboard
┃🕹➺ .rol | rango
┃🕹➺ .inventario | inventory
┃🕹➺ .aventura | adventure
┃🕹➺ .caza | cazar | hunt
┃🕹➺ .pescar | fishing
┃🕹➺ .animales
┃🕹➺ .alimentos
┃🕹➺ .curar | heal
┃🕹➺ .sell
┃🕹➺ .verificar | registrar
┃🕹➺ .perfil | profile
┃🕹➺ .myns
┃🕹➺ .unreg numero de serie
┃🕹➺ .minardiamantes | minargemas
┃🕹➺ .minargatacoins | minarcoins
┃🕹➺ .minarexperiencia | minarexp
┃🕹➺ .minar : minar2 : minar3
┃🕹➺ .reclamar | regalo | claim
┃🕹➺ .cadahora | hourly
┃🕹➺ .cadasemana | semanal | weekly
┃🕹➺ .cadames | mes | monthly
┃🕹➺ .cofre | abrircofre | coffer
┃🕹➺ .trabajar | work
╰━━━━━━━━━━━⬣

╭━[ TOP EN OPTIMUS ]━⬣
┃🏆➺ .top (inhabilitado)
╰━━━━━━━━━━━⬣

╭━[ STICKERS ]━⬣
┃🙂‍↕ .sticker | s imagen o video
┃🙂‍↕.sticker | s url de tipo jpg
┃🙂‍↕ .emojimix 😺+😆
┃🙂‍↕ .dado
┃🙂‍↕ .qc
╰━━━━━━━━━━━⬣

╭━[ MODIFICAR STICKERS ]━⬣
┃✨ .wm packname|author
┃✨ .wm texto1|texto2
╰━━━━━━━━━━━⬣


╭━[ MENU PARA PROPIETARIO/A ]━⬣
┃👑➺ .join enlace
┃👑➺ .unete enlace
┃👑➺ .darmonedas cantidad
┃👑➺ .darxp cantidad
┃👑➺ .darcoins cantidad
┃👑➺ .addprem | userpremium @tag cantidad
┃👑➺ .addprem2 | userpremium2 @tag cantidad
┃👑➺ .addprem3 | userpremium3 @tag cantidad
┃👑➺ .addprem4 | userpremium4 @tag cantidad
┃👑➺ .idioma | language
┃👑➺ .cajafuerte
┃👑➺ .comunicar | broadcastall | bc texto
┃👑➺ .broadcastchats | bcc texto
┃👑➺ .comunicarpv texto
┃👑➺ .broadcastgc texto
┃👑➺ .comunicargrupos texto
┃👑➺ .borrartmp | cleartmp
┃👑➺ .delexp @tag
┃👑➺ .delcoins @tag
┃👑➺ .deldiamantes @tag
┃👑➺ .reiniciar | restart
┃👑➺ .actualizar | update
┃👑➺ .addprem | +prem @tag
┃👑➺ .delprem | -prem @tag
┃👑➺ .listapremium | listprem
┃👑➺ .añadirdiamantes @tag cantidad
┃👑➺ .añadirxp @tag cantidad
┃👑➺ .añadircoins @tag cantidad
┃👑➺ .chetar
┃👑➺ .infinity
╰━━━━━━━━━━⬣*
╭━━━━━━━━━━⬣
> GRACIAS POR LEER. Sport-Bot-MD (DcA Alfo)
╰━━━━━━━━━━⬣
  `.trim()

  // Ruta relativa al archivo desde el mismo nivel del handler
  const imgPath = path.join('./src', 'menu-bot.jpg')
  const buffer = await fs.readFile(imgPath)

  await conn.sendMessage(m.chat, {
await conn.reply(m.chat, response, m, fake)
    image: buffer,
    caption: mensaje,
    mentions: [m.sender] // 👈 Esto permite que el usuario sea mencionado correctamente
  }, { quoted: m })
}

handler.help = ['requisitos']
handler.tags = ['grupo']
handler.command = ['comandos', 'comands']

handler.group = true
handler.admin = true

export default handler

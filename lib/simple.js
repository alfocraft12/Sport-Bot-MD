// Fix 2025 - MysitcBot and Fu*k You Meta® - LID Fix 98% - replace lids for numbers real.
import path from "path";
import { toAudio } from "./converter.js";
import chalk from "chalk";
import fetch from "node-fetch";
import PhoneNumber from "awesome-phonenumber";
import fs from "fs";
import util from "util";
import { fileTypeFromBuffer } from "file-type";
import { format } from "util";
import { fileURLToPath } from "url";
import store from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import("baileys")}
 */
const {
  default: _makeWaSocket,
  makeWALegacySocket,
  proto,
  downloadContentFromMessage,
  jidDecode,
  areJidsSameUser,
  generateWAMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  WAMessageStubType,
  extractMessageContent,
  makeInMemoryStore,
  getAggregateVotesInPollMessage,
  prepareWAMessageMedia,
  WA_DEFAULT_EPHEMERAL,
  PHONENUMBER_MCC,
} = (await import("@whiskeysockets/baileys")).default;

export function makeWASocket(connectionOptions, options = {}) {
  /**
   * @type {import("baileys").WASocket | import("baileys").WALegacySocket}
   */
  const conn = (global.opts["legacy"] ? makeWALegacySocket : _makeWaSocket)(
    connectionOptions,
  );

  const sock = Object.defineProperties(conn, {
    chats: {
      value: { ...(options.chats || {}) },
      writable: true,
    },
    decodeJid: {
      value(jid) {
        if (!jid || typeof jid !== "string")
          return (!nullish(jid) && jid) || null;
        return jid.decodeJid();
      },
    },
    logger: {
      get() {
        return {
          info(...args) {
            console.log(
              chalk.bold.bgRgb(51, 204, 51)("INFO "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.cyan(format(...args)),
            );
          },
          error(...args) {
            console.log(
              chalk.bold.bgRgb(247, 38, 33)("ERROR "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.rgb(255, 38, 0)(format(...args)),
            );
          },
          warn(...args) {
            console.log(
              chalk.bold.bgRgb(255, 153, 0)("WARNING "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.redBright(format(...args)),
            );
          },
          trace(...args) {
            console.log(
              chalk.grey("TRACE "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.white(format(...args)),
            );
          },
          debug(...args) {
            console.log(
              chalk.bold.bgRgb(66, 167, 245)("DEBUG "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.white(format(...args)),
            );
          },
        };
      },
      enumerable: true,
    },
    sendNyanCat: {
      async value(jid, text = "", buffer, title, body, url, quoted, options) {
        if (buffer) {
          try {
            ((type = await conn.getFile(buffer)), (buffer = type.data));
          } catch {
            buffer = buffer;
          }
        }
        const prep = generateWAMessageFromContent(
          jid,
          {
            extendedTextMessage: {
              text: text,
              contextInfo: {
                externalAdReply: {
                  title: title,
                  body: body,
                  thumbnail: buffer,
                  sourceUrl: url,
                },
                mentionedJid: await conn.parseMention(text),
              },
            },
          },
          { quoted: quoted },
        );
        return conn.relayMessage(jid, prep.message, { messageId: prep.key.id });
      },
    },
    sendPayment: {
      async value(jid, amount, text, quoted, options) {
        conn.relayMessage(
          jid,
          {
            requestPaymentMessage: {
              currencyCodeIso4217: "PEN",
              amount1000: amount,
              requestFrom: null,
              noteMessage: {
                extendedTextMessage: {
                  text: text,
                  contextInfo: {
                    externalAdReply: {
                      showAdAttribution: true,
                    },
                    mentionedJid: conn.parseMention(text),
                  },
                },
              },
            },
          },
          {},
        );
      },
    },
    getFile: {
      /**
       * getBuffer hehe
       * @param {fs.PathLike} PATH
       * @param {Boolean} saveToFile
       */
      async value(PATH, saveToFile = false) {
        let res;
        let filename;
        const data = Buffer.isBuffer(PATH)
          ? PATH
          : PATH instanceof ArrayBuffer
            ? PATH.toBuffer()
            : /^data:.*?\/.*?;base64,/i.test(PATH)
              ? Buffer.from(PATH.split`,`[1], "base64")
              : /^https?:\/\//.test(PATH)
                ? await (res = await fetch(PATH)).buffer()
                : fs.existsSync(PATH)
                  ? ((filename = PATH), fs.readFileSync(PATH))
                  : typeof PATH === "string"
                    ? PATH
                    : Buffer.alloc(0);
        if (!Buffer.isBuffer(data))
          throw new TypeError("Result is not a buffer");
        const type = (await fileTypeFromBuffer(data)) || {
          mime: "application/octet-stream",
          ext: ".bin",
        };
        if (data && saveToFile && !filename)
          ((filename = path.join(
            __dirname,
            "../tmp/" + new Date() * 1 + "." + type.ext,
          )),
            await fs.promises.writeFile(filename, data));
        return {
          res,
          filename,
          ...type,
          data,
          deleteFile() {
            return filename && fs.promises.unlink(filename);
          },
        };
      },
      enumerable: true,
    },
    waitEvent: {
      /**
       * waitEvent
       * @param {String} eventName
       * @param {Boolean} is
       * @param {Number} maxTries
       */
      value(eventName, is = () => true, maxTries = 25) {
        // Idk why this exist?
        return new Promise((resolve, reject) => {
          let tries = 0;
          const on = (...args) => {
            if (++tries > maxTries) reject("Max tries reached");
            else if (is()) {
              conn.ev.off(eventName, on);
              resolve(...args);
            }
          };
          conn.ev.on(eventName, on);
        });
      },
    },
    relayWAMessage: {
      async value(pesanfull) {
        if (pesanfull.message.audioMessage) {
          await conn.sendPresenceUpdate("recording", pesanfull.key.remoteJid);
        } else {
          await conn.sendPresenceUpdate("composing", pesanfull.key.remoteJid);
        }
        const mekirim = await conn.relayMessage(
          pesanfull.key.remoteJid,
          pesanfull.message,
          { messageId: pesanfull.key.id },
        );
        conn.ev.emit("messages.upsert", {
          messages: [pesanfull],
          type: "append",
        });
        return mekirim;
      },
    },
    sendFile: {
      /**
       * Send Media/File with Automatic Type Specifier
       * @param {String} jid
       * @param {String|Buffer} path
       * @param {String} filename
       * @param {String} caption
       * @param {import("baileys").proto.WebMessageInfo} quoted
       * @param {Boolean} ptt
       * @param {Object} options
       */
      async value(
        jid,
        path,
        filename = "",
        caption = "",
        quoted,
        ptt = false,
        options = {},
      ) {
        const type = await conn.getFile(path, true);
        let { res, data: file, filename: pathFile } = type;
        if ((res && res.status !== 200) || file.length <= 65536) {
          try {
            throw { json: JSON.parse(file.toString()) };
          } catch (e) {
            if (e.json) throw e.json;
          }
        }
        // const fileSize = fs.statSync(pathFile).size / 1024 / 1024
        // if (fileSize >= 100) throw new Error('File size is too big!')
        const opt = {};
        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;
        let mtype = "";
        let mimetype = options.mimetype || type.mime;
        let convert;
        if (
          /webp/.test(type.mime) ||
          (/image/.test(type.mime) && options.asSticker)
        )
          mtype = "sticker";
        else if (
          /image/.test(type.mime) ||
          (/webp/.test(type.mime) && options.asImage)
        )
          mtype = "image";
        else if (/video/.test(type.mime)) mtype = "video";
        else if (/audio/.test(type.mime)) {
          ((convert = await toAudio(file, type.ext)),
            (file = convert.data),
            (pathFile = convert.filename),
            (mtype = "audio"),
            (mimetype = options.mimetype || "audio/mpeg; codecs=opus"));
        } else mtype = "document";
        if (options.asDocument) mtype = "document";

        delete options.asSticker;
        delete options.asLocation;
        delete options.asVideo;
        delete options.asDocument;
        delete options.asImage;

        const message = {
          ...options,
          caption,
          ptt,
          [mtype]: { url: pathFile },
          mimetype,
          fileName: filename || pathFile.split("/").pop(),
        };
        /**
         * @type {import("baileys").proto.WebMessageInfo}
         */
        let m;
        try {
          m = await conn.sendMessage(jid, message, { ...opt, ...options });
        } catch (e) {
          console.error(e);
          m = null;
        } finally {
          if (!m)
            m = await conn.sendMessage(
              jid,
              { ...message, [mtype]: file },
              { ...opt, ...options },
            );
          file = null; // releasing the memory
          return m;
        }
      },
      enumerable: true,
    },
    sendContact: {
      /**
       * Send Contact
       * @param {String} jid
       * @param {String[][]|String[]} data
       * @param {import("baileys").proto.WebMessageInfo} quoted
       * @param {Object} options
       */
      async value(jid, data, quoted, options) {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Data must be a non-empty array");
        }
        if (!Array.isArray(data[0]) && typeof data[0] === "string")
          data = [data];
        const contacts = [];
        for (let [number, name] of data) {
          if (!number || !name) continue;
          number = number.replace(/[^0-9]/g, "");
          const njid = number + "@s.whatsapp.net";
          const biz =
            (await conn.getBusinessProfile(njid).catch((_) => null)) || {};
          const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, "\\n")};;;
FN:${name.replace(/\n/g, "\\n")}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber("+" + number).getNumber("international")}${
            biz.description
              ? `
X-WA-BIZ-NAME:${(conn.chats[njid]?.vname || conn.getName(njid) || name).replace(/\n/, "\\n")}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, "\\n")}
`.trim()
              : ""
          }
END:VCARD
        `.trim();
          contacts.push({ vcard, displayName: name });
        }
        return await conn.sendMessage(
          jid,
          {
            ...options,
            contacts: {
              ...options,
              displayName:
                (contacts.length >= 2
                  ? `${contacts.length} kontak`
                  : contacts[0]?.displayName) || null,
              contacts,
            },
          },
          { quoted, ...options },
        );
      },
      enumerable: true,
    },
    reply: {
      /**
       * Reply to a message
       * @param {String} jid
       * @param {String|Buffer} text
       * @param {import("baileys").proto.WebMessageInfo} quoted
       * @param {Object} options
       */
      value(jid, text = "", quoted, options) {
        return Buffer.isBuffer(text)
          ? conn.sendFile(jid, text, "file", "", quoted, false, options)
          : conn.sendMessage(jid, { ...options, text }, { quoted, ...options });
      },
    },

    /**
     * Send nativeFlowMessage
     * By: https://github.com/GataNina-Li
     */

    sendButtonMessages: {
      async value(jid, messages, quoted, options) {
        if (!Array.isArray(messages) || messages.length === 0) {
          throw new Error("Messages must be a non-empty array");
        }
        messages.length > 1
          ? await conn.sendCarousel(jid, messages, quoted, options)
          : await conn.sendNCarousel(jid, ...messages[0], quoted, options);
      },
    },

    /**
     * Send nativeFlowMessage
     */

    sendNCarousel: {
      async value(
        jid,
        text = "",
        footer = "",
        buffer,
        buttons = [],
        copy,
        urls = [],
        list = [],
        quoted,
        options = {},
      ) {
        // Validaciones críticas
        if (!Array.isArray(buttons)) {
          console.warn('Buttons parameter is not an array:', buttons);
          buttons = [];
        }
        if (!Array.isArray(urls)) urls = [];
        if (!Array.isArray(list)) list = [];
        
        let img, video;
        if (buffer) {
          if (/^https?:\/\//i.test(buffer)) {
            try {
              const response = await fetch(buffer);
              const contentType = response.headers.get("content-type");
              if (/^image\//i.test(contentType)) {
                img = await prepareWAMessageMedia(
                  {
                    image: {
                      url: buffer,
                    },
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              } else if (/^video\//i.test(contentType)) {
                video = await prepareWAMessageMedia(
                  {
                    video: {
                      url: buffer,
                    },
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              } else {
                console.error("Incompatible MIME type:", contentType);
              }
            } catch (error) {
              console.error("Failed to get MIME type:", error);
            }
          } else {
            try {
              const type = await conn.getFile(buffer);
              if (/^image\//i.test(type.mime)) {
                img = await prepareWAMessageMedia(
                  {
                    image: /^https?:\/\//i.test(buffer)
                      ? {
                          url: buffer,
                        }
                      : type && type?.data,
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              } else if (/^video\//i.test(type.mime)) {
                video = await prepareWAMessageMedia(
                  {
                    video: /^https?:\/\//i.test(buffer)
                      ? {
                          url: buffer,
                        }
                      : type && type?.data,
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              }
            } catch (error) {
              console.error("Failed to get file type:", error);
            }
          }
        }
        
        const dynamicButtons = buttons.map((btn) => {
          if (!btn || !Array.isArray(btn) || btn.length < 2) {
            console.warn('Invalid button format:', btn);
            return null;
          }
          return {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: btn[0] || '',
              id: btn[1] || '',
            }),
          };
        }).filter(Boolean);

        if (copy && (typeof copy === "string" || typeof copy === "number")) {
          dynamicButtons.push({
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "Copy",
              copy_code: copy,
            }),
          });
        }

        urls.forEach((url) => {
          if (Array.isArray(url) && url.length >= 2) {
            dynamicButtons.push({
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: url[0] || '',
                url: url[1] || '',
                merchant_url: url[1] || '',
              }),
            });
          }
        });

        list.forEach((lister) => {
          if (Array.isArray(lister) && lister.length >= 2) {
            dynamicButtons.push({
              name: "single_select",
              buttonParamsJson: JSON.stringify({
                title: lister[0] || '',
                sections: lister[1] || [],
              }),
            });
          }
        });

        const interactiveMessage = {
          body: {
            text: text || "",
          },
          footer: {
            text: footer || wm || "",
          },
          header: {
            hasMediaAttachment:
              img?.imageMessage || video?.videoMessage ? true : false,
            imageMessage: img?.imageMessage || null,
            videoMessage: video?.videoMessage || null,
          },
          nativeFlowMessage: {
            buttons: dynamicButtons,
            messageParamsJson: "",
          },
          ...Object.assign(
            {
              mentions:
                typeof text === "string" ? conn.parseMention(text || "@0") : [],
              contextInfo: {
                mentionedJid:
                  typeof text === "string"
                    ? conn.parseMention(text || "@0")
                    : [],
              },
            },
            {
              ...(options || {}),
              ...(conn.temareply?.contextInfo && {
                contextInfo: {
                  ...(options?.contextInfo || {}),
                  ...conn.temareply?.contextInfo,
                  externalAdReply: {
                    ...(options?.contextInfo?.externalAdReply || {}),
                    ...conn.temareply?.contextInfo?.externalAdReply,
                  },
                },
              }),
            },
          ),
        };
        const messageContent = proto.Message.fromObject({
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage,
            },
          },
        });
        const msgs = await generateWAMessageFromContent(jid, messageContent, {
          userJid: conn.user.jid,
          quoted: quoted,
          upload: conn.waUploadToServer,
          ephemeralExpiration: WA_DEFAULT_EPHEMERAL,
        });
        await conn.relayMessage(jid, msgs.message, {
          messageId: msgs.key.id,
        });
      },
    },
    /**
     * Send carouselMessage
     */
    sendCarousel: {
      async value(
        jid,
        text = "",
        footer = "",
        text2 = "",
        messages = [],
        quoted,
        options = {},
      ) {
        if (!Array.isArray(messages) || messages.length === 0) {
          throw new Error("Messages must be a non-empty array");
        }
        
        if (messages.length > 1) {
          const cards = await Promise.all(
            messages.map(
              async ([
                text = "",
                footer = "",
                buffer,
                buttons = [],
                copy,
                urls = [],
                list = [],
              ]) => {
                // Validaciones para cada card
                if (!Array.isArray(buttons)) buttons = [];
                if (!Array.isArray(urls)) urls = [];
                if (!Array.isArray(list)) list = [];
                
                let img, video;
                if (/^https?:\/\//i.test(buffer)) {
                  try {
                    const response = await fetch(buffer);
                    const contentType = response.headers.get("content-type");
                    if (/^image\//i.test(contentType)) {
                      img = await prepareWAMessageMedia(
                        {
                          image: {
                            url: buffer,
                          },
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    } else if (/^video\//i.test(contentType)) {
                      video = await prepareWAMessageMedia(
                        {
                          video: {
                            url: buffer,
                          },
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    } else {
                      console.error("Incompatible MIME types:", contentType);
                    }
                  } catch (error) {
                    console.error("Failed to get MIME type:", error);
                  }
                } else {
                  try {
                    const type = await conn.getFile(buffer);
                    if (/^image\//i.test(type.mime)) {
                      img = await prepareWAMessageMedia(
                        {
                          image: /^https?:\/\//i.test(buffer)
                            ? {
                                url: buffer,
                              }
                            : type && type?.data,
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    } else if (/^video\//i.test(type.mime)) {
                      video = await prepareWAMessageMedia(
                        {
                          video: /^https?:\/\//i.test(buffer)
                            ? {
                                url: buffer,
                              }
                            : type && type?.data,
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    }
                  } catch (error) {
                    console.error("Failed to get file type:", error);
                  }
                }
                
                const dynamicButtons = buttons.map((btn) => {
                  if (!btn || !Array.isArray(btn) || btn.length < 2) {
                    console.warn('Invalid button format:', btn);
                    return null;
                  }
                  return {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: btn[0] || '',
                      id: btn[1] || '',
                    }),
                  };
                }).filter(Boolean);

                copy = Array.isArray(copy) ? copy : [copy];
                copy.filter(c => c).forEach((copyItem) => {
                  if (Array.isArray(copyItem) && copyItem.length > 0) {
                    dynamicButtons.push({
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Copy",
                        copy_code: copyItem[0] || '',
                      }),
                    });
                  }
                });

                urls.forEach((url) => {
                  if (Array.isArray(url) && url.length >= 2) {
                    dynamicButtons.push({
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: url[0] || '',
                        url: url[1] || '',
                        merchant_url: url[1] || '',
                      }),
                    });
                  }
                });

                list.forEach((lister) => {
                  if (Array.isArray(lister) && lister.length >= 2) {
                    dynamicButtons.push({
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: lister[0] || '',
                        sections: lister[1] || [],
                      }),
                    });
                  }
                });

                return {
                  body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: text || "",
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: footer || wm || "",
                  }),
                  header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: text2 || "",
                    subtitle: text || "",
                    hasMediaAttachment:
                      img?.imageMessage || video?.videoMessage ? true : false,
                    imageMessage: img?.imageMessage || null,
                    videoMessage: video?.videoMessage || null,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.fromObject(
                      {
                        buttons: dynamicButtons,
                        messageParamsJson: "",
                      },
                    ),
                  ...Object.assign(
                    {
                      mentions:
                        typeof text === "string"
                          ? conn.parseMention(text || "@0")
                          : [],
                      contextInfo: {
                        mentionedJid:
                          typeof text === "string"
                            ? conn.parseMention(text || "@0")
                            : [],
                      },
                    },
                    {
                      ...(options || {}),
                      ...(conn.temareply?.contextInfo && {
                        contextInfo: {
                          ...(options?.contextInfo || {}),
                          ...conn.temareply?.contextInfo,
                          externalAdReply: {
                            ...(options?.contextInfo?.externalAdReply || {}),
                            ...conn.temareply?.contextInfo?.externalAdReply,
                          },
                        },
                      }),
                    },
                  ),
                };
              },
            ),
          );
          const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: text || "",
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: footer || wm || "",
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: text || "",
              subtitle: text || "",
              hasMediaAttachment: false,
            }),
            carouselMessage:
              proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards,
              }),
            ...Object.assign(
              {
                mentions:
                  typeof text === "string"
                    ? conn.parseMention(text || "@0")
                    : [],
                contextInfo: {
                  mentionedJid:
                    typeof text === "string"
                      ? conn.parseMention(text || "@0")
                      : [],
                },
              },
              {
                ...(options || {}),
                ...(conn.temareply?.contextInfo && {
                  contextInfo: {
                    ...(options?.contextInfo || {}),
                    ...conn.temareply?.contextInfo,
                    externalAdReply: {
                      ...(options?.contextInfo?.externalAdReply || {}),
                      ...conn.temareply?.contextInfo?.externalAdReply,
                    },
                  },
                }),
              },
            ),
          });
          const messageContent = proto.Message.fromObject({
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage,
              },
            },
          });
          const msgs = await generateWAMessageFromContent(jid, messageContent, {
            userJid: conn.user.jid,
            quoted: quoted,
            upload: conn.waUploadToServer,
            ephemeralExpiration: WA_DEFAULT_EPHEMERAL,
          });
          await conn.relayMessage(jid, msgs.message, {
            messageId: msgs.key.id,
          });
        } else {
          await conn.sendNCarousel(jid, ...messages[0], quoted, options);
        }
      },
    },

    sendButton: {
      async value(
        jid,
        text = "",
        footer = "",
        buffer,
        buttons = [],
        copy,
        urls = [],
        quoted,
        options = {},
      ) {
        // Validaciones críticas
        if (!Array.isArray(buttons)) {
          console.warn('Buttons parameter is not an array:', buttons);
          buttons = [];
        }
        if (!Array.isArray(urls)) urls = [];

        let img, video;

        if (/^https?:\/\//i.test(buffer)) {
          try {
            // Obtener el tipo MIME de la URL
            const response = await fetch(buffer);
            const contentType = response.headers.get("content-type");
            if (/^image\//i.test(contentType)) {
              img = await prepareWAMessageMedia(
                { image: { url: buffer } },
                { upload: conn.waUploadToServer },
              );
            } else if (/^video\//i.test(contentType)) {
              video = await prepareWAMessageMedia(
                { video: { url: buffer } },
                { upload: conn.waUploadToServer },
              );
            } else {
              console.error("Tipo MIME no compatible:", contentType);
            }
          } catch (error) {
            console.error("Error al obtener el tipo MIME:", error);
          }
        }

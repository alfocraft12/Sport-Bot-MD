import { tmpdir } from 'os'
import path, { join } from 'path'
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  rmSync
} from 'fs'

let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => { 

  const tmp = [tmpdir(), join(__dirname, '../tmp')]
  const filename = []

  tmp.forEach(dirname => {
    if (existsSync(dirname)) {
      readdirSync(dirname).forEach(file => {
        const fullPath = join(dirname, file)
        filename.push(fullPath)
      })
    }
  })

  filename.forEach(file => {
    try {
      const stats = statSync(file)
      if (stats.isDirectory()) {
        // Borrar carpeta completa
        rmSync(file, { recursive: true, force: true })
      } else {
        // Borrar archivo
        unlinkSync(file)
      }
    } catch (e) {
      console.error(`❌ Error eliminando ${file}:`, e.message)
    }
  })

  conn.reply(m.chat, `🚩 Realizado, ya se ha eliminado el contenido de las carpetas tmp`, m, rcanal)
}

handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = ['cleartmp', 'borrartmp', 'borrarcarpetatmp', 'vaciartmp']
handler.exp = 500
handler.rowner = true
export default handler

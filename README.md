# 🤖 Sport-Bot-MD

Versión personalizada del bot multipropósito para grupos de WhatsApp, diseñada y mantenida por **@alfocraft12 (Alfo)**.  
Ideal para clanes, comunidades de juegos y grupos gaming que buscan control, diversión y automatización 🔥🎮



## ✨ Características principales

- 🧠 Comandos nuevos y optimizados
- 🏷️ Títulos automáticos para miembros del grupo
- 👑 Owners ya configurados con permisos especiales
- 🎮 Herramientas útiles para clanes y torneos
- 🛡️ Protecciones como antilinks y antifakes
- 📁 Carpeta organizada y editable (`plugins`, `media`, etc.)



🍟 **`INSTALACION MANUAL POR TERMUX`**

[`🚩 Instalar Termux Clic Aqui`](https://www.mediafire.com/file/pqd980pnrqrz7r3/termux-app_v0.118.1+github-debug_arm64-v8a.apk/file)

> ESCRIBE LOS SIGUIENTES COMANDOS UNO POR UNO:

```bash
termux-setup-storage
```
```bash
apt update && apt upgrade && pkg install -y git nodejs ffmpeg imagemagick yarn
```
```bash
git clone https://github.com/alfocraft12/Sport-Bot-MD.git && cd Sport-Bot-MD
```
```bash
yarn install && npm update && npm install
```
```bash
npm start
```

🍟 **`ACTIVAR EN TERMUX EN CASO DE DETENERSE`**
```bash
ESCRIBE LOS SIGUIENTES COMANDOS UNO POR UNO:
> cd 
> cd Sport-Bot-MD
> npm start
```

🔥 **`OBTENER OTRO CODIGO QR`**
```bash
> ESCRIBE LOS SIGUIENTES COMANDOS UNO POR UNO:
> cd HuTao-Proyect
> rm -rf Seccion-activas
> npm start
```

🍟 **`HuTao-Proyect 24/7 (TERMUX)`**
```bash
> termux-wake-lock && npm i -g pm2 && pm2 start index.js && pm2 save && pm2 logs 
```

💥 **`ACTUALIZAR HuTao`**
> Note Comandos para actualizar HuTao-Proyect de forma automática
```bash
grep -q 'bash\|wget' <(dpkg -l) || apt install -y bash wget && wget -O - https://raw.githubusercontent.com/CheirZ/HuTao-Proyect/master/update.sh | bash
```
Para que no pierda su progreso en HuTao, estos comandos realizarán un respaldo de su `database.json` y se agregará a la versión más reciente.

> Warning Estos comandos solo funcionan para TERMUX, REPLIT, LINUX

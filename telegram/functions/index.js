const functions = require('firebase-functions')
const Telegraf = require('telegraf')

const bot = new Telegraf(functions.config().telegram.key)

bot.start(ctx => ctx.reply('Hola, bienvenido a footStats. Para obtener ayuda use el comando /help.'))

exports.bot = functions
  .region('europe-west1')
  .https.onRequest((req, res) =>
    bot.handleUpdate(req.body, res).then((rv) => !rv && res.sendStatus(200))
  )

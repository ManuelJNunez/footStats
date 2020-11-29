const functions = require('firebase-functions')
const Telegraf = require('telegraf')
const data = require('./data.json')
const credits = require('./credits.json')

const bot = new Telegraf(functions.config().telegram.key)

bot.start(ctx => ctx.reply('Bienvenido a footStats BOT. Para obtener ayuda use el comando /help.'))

bot.help(ctx => ctx.reply('Comandos disponibles:\n/liga - muestra la tabla de clasificación de La Liga de fútbol española.\n/credits - muestra las personas que han contribuido en este proyecto.'))

bot.command('liga', async (ctx) => {
  const table = data.api.standings[0]

  let botresponse = 'La tabla de clasificación de La Liga es la siguiente:\n'

  for (const team of table) {
    botresponse += `${team.rank}. ${team.teamName} (<b>${team.points} ptos.</b>)\n`
  }

  ctx.replyWithHTML(botresponse)
})

bot.command('credits', async (ctx) => {
  let botresponse = 'Créditos del proyecto:\n'

  for (const person of credits.contributors) {
    botresponse += `-${person.name}: ${person.reason}\n`
  }

  ctx.reply(botresponse)
})

exports.bot = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) =>
    bot.handleUpdate(req.body, res).then((rv) => !rv && res.sendStatus(200))
  )

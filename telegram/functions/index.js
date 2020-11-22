const functions = require('firebase-functions')
const Telegraf = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(functions.config().telegram.key)

bot.start(ctx => ctx.reply('Bienvenido a footStats BOT. Para obtener ayuda use el comando /help.'))

bot.command('liga', async (ctx) => {
  let botresponse = 'La tabla de clasificación de La Liga es la siguiente:\n'

  const response = await axios.get(`${functions.config().footstats.url}/league`)

  for (const team of response.data.table) {
    botresponse += `${team.rank}. ${team.teamName} (<b>${team.points} ptos.</b>)\n`
  }

  ctx.replyWithHTML(botresponse)
})

bot.command('credits', async (ctx) => {
  let botresponse = 'Créditos del proyecto:\n'

  const response = await axios.get(`${functions.config().footstats.url}/credits`)

  for (const person of response.data.contributors) {
    botresponse += `${person.name}: ${person.reason}`
  }

  ctx.reply(botresponse)
})

exports.bot = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) =>
    bot.handleUpdate(req.body, res).then((rv) => !rv && res.sendStatus(200))
  )

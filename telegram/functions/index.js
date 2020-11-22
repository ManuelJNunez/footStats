const functions = require('firebase-functions')
const Telegraf = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(functions.config().telegram.key)

bot.start(ctx => ctx.reply('Bienvenido a footStats BOT. Para obtener ayuda use el comando /help.'))

bot.command('liga', (ctx) => {
  let response = 'La tabla de clasificación de La Liga es la siguiente:\n'

  axios({
    method: 'get',
    url: `${functions.config().footstats.url}/league`,
    responseType: 'json'
  })
    .then(function (response) {
      const data = response.data

      for (const team of data.table) {
        response += `${team.rank}. ${team.teamName} (**${team.points} ptos.**)\n`
      }

      ctx.reply(response)
    })
})

exports.bot = functions
  .region('europe-west1')
  .https.onRequest((req, res) =>
    bot.handleUpdate(req.body, res).then((rv) => !rv && res.sendStatus(200))
  )

const functions = require('firebase-functions');
const contrib = require('./credits.json');
const data = require('./data.json');

const start = (message, res) => {
  const chatId = message.chat.id;
  const response =
    'Bienvenido a footStats BOT. Para obtener ayuda use el comando /help.';
  res
    .status(200)
    .json({ text: response, method: 'sendMessage', chat_id: chatId });
};

const help = (message, res) => {
  const chatId = message.chat.id;
  const response =
    'Comandos disponibles:\n/liga - muestra la tabla de clasificación de La Liga de fútbol española.\n/credits - muestra las personas que han contribuido en este proyecto.';
  res
    .status(200)
    .json({ text: response, method: 'sendMessage', chat_id: chatId });
};

const liga = (message, res) => {
  const chatId = message.chat.id;
  const table = data.api.standings[0];

  let response = 'La tabla de clasificación de La Liga es la siguiente:\n';

  for (const team of table) {
    response += `${team.rank}. ${team.teamName} (<b>${team.points} ptos.</b>)\n`;
  }

  res.status(200).json({
    text: response,
    method: 'sendMessage',
    chat_id: chatId,
    parse_mode: 'html',
  });
};

const credits = (message, res) => {
  const chatId = message.chat.id;

  let response = 'Créditos del proyecto:\n';

  for (const person of contrib.contributors) {
    response += `-${person.name}: ${person.reason}\n`;
  }

  res
    .status(200)
    .json({ text: response, method: 'sendMessage', chat_id: chatId });
};

exports.bot = functions.region('europe-west1').https.onRequest((req, res) => {
  if ('message' in req.body) {
    const texto = req.body.message.text;

    if (texto === '/start') {
      start(req.body.message, res);
    } else if (texto === '/help') {
      help(req.body.message, res);
    } else if (texto === '/liga') {
      liga(req.body.message, res);
    } else if (texto === '/credits') {
      credits(req.body.message, res);
    } else {
      res
        .status(200)
        .json({ text: 'hola', method: 'sendMessage', chat_id: -1 });
    }
  } else {
    res.status(200).json({ status: 'Healthy' });
  }
});

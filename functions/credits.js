const data = require('./credits.json')

exports.handler = async function (event, context) {
  const response = data

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  }
}

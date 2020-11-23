// Indica el estado de la API
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'Healthy' })
  }
}

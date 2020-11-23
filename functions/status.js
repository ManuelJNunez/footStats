// Indica el estado de la API
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'Healthy' })
  }
}

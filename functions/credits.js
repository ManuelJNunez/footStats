exports.handler = function (event, context) {
  const response = {
    contributors: [
      {
        name: 'Manuel Jesús Núñez Ruiz',
        reason: 'Por haber desarrollado esta aplicación'
      },
      {
        name: 'CD Sporting Benamejí',
        reson: 'Los que me pidieron que desarrollara una aplicación para poder guardar estadísticas de partidos para poder utilizarlas en sus entrenamientos'
      }
    ]
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

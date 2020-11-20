const table = require('./data')

exports.handler = async function (event, context) {
  const response = {
    table: []
  }

  for (const team of table) {
    response.table.push({
      rank: team.rank,
      teamName: team.teamName,
      points: team.points
    })
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

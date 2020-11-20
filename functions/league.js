const fs = require('fs')

exports.handler = async function (event, context) {
  const rawdata = fs.readFileSync('functions/data.json')
  const table = JSON.parse(rawdata).api.standings[0]

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

const data = require('./data.json');

exports.handler = async function (event, context) {
  const table = data.api.standings[0];

  const response = {
    table: [],
  };

  for (const team of table) {
    response.table.push({
      rank: team.rank,
      teamName: team.teamName,
      points: team.points,
    });
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
};

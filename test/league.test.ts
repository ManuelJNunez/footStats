import handler from '../functions/league';

describe('Tests del handler de league.js', async function () {
  const response = await handler.handler({ httpMethod: 'GET' });
  const TABLE_LENGTH = 20;

  it('Debería de devolver 200 en statusCode', function () {
    expect(response.statusCode).toEqual(200);
  });

  it('Debería de devolver un objeto con una estructura determinada', function () {
    const body = JSON.parse(response.body);

    expect(body).toHaveProperty('table');
    expect(body.table).toHaveLength(TABLE_LENGTH);

    for (const team of body.table) {
      expect(team).toHaveProperty('teamName');
      expect(team).toHaveProperty('rank');
      expect(team).toHaveProperty('points');
    }
  });
});

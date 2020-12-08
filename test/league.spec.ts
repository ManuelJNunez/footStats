import handler from '../functions/league';

const TABLE_LENGTH = 20;

it('Debería de devolver 200 en statusCode', async () => {
  const response = await handler.handler({ httpMethod: 'GET' });
  expect(response.statusCode).toEqual(200);
});

it('Debería de devolver un objeto con una estructura determinada', async () => {
  const response = await handler.handler({ httpMethod: 'GET' });
  const body = JSON.parse(response.body);

  expect(body).toHaveProperty('table');
  expect(body.table).toHaveLength(TABLE_LENGTH);

  for (const team of body.table) {
    expect(team).toHaveProperty('teamName');
    expect(team).toHaveProperty('rank');
    expect(team).toHaveProperty('points');
  }
});

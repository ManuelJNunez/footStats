import handler from './../functions/credits';
import data from './../functions/credits.json';

describe('Tests del handler de credits.js', async function () {
  const response = await handler.handler({ httpMethod: 'GET' });
  const CONT_LENGTH = 2;

  it('Debería de devolver 200 en statusCode', function () {
    expect(response.statusCode).toEqual(200);
  });

  it('Debería de volver un objeto con una estructura determinada', function () {
    const body = JSON.parse(response.body);

    expect(body).toHaveProperty('contributors');
    expect(body.contributors).toHaveLength(CONT_LENGTH);

    for (let i = 0; i < body.contributors.length; i++) {
      expect(body.contributors[i]).toHaveProperty(
        'name',
        data.contributors[i].name,
      );
      expect(body.contributors[i]).toHaveProperty(
        'reason',
        data.contributors[i].reason,
      );
    }
  });
});

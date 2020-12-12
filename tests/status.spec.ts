import handler from '../functions/status';

it('Debería de devolver 200 en statusCode', async () => {
  const response = await handler.handler({ httpMethod: 'GET' });
  expect(response.statusCode).toEqual(200);
});

it('Debería de volver un objeto con una estructura determinada', async () => {
  const response = await handler.handler({ httpMethod: 'GET' });
  const body = JSON.parse(response.body);

  expect(body).toHaveProperty('status', 'Healthy');
});

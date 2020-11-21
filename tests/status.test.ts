import handler from './../functions/status'
import { expect } from 'chai'

describe('Tests del handler de status.js', async function () {
  const response = await handler.handler({ httpMethod: 'GET' })

  it('Debería de devolver 200 en statusCode', function () {
    expect(response.statusCode).to.be.equal(200)
  })

  it('Debería de volver un objeto con una estructura determinada', function () {
    const body = JSON.parse(response.body)

    expect(body).to.have.property('status', 'Healthy')
  })
})

import { expect } from 'chai'
import handler from './../functions/credits'
import data from './../functions/credits.json'

describe('Tests del handler de credits.js', async function () {
  const response = await handler.handler({ httpMethod: 'GET' })
  const CONT_LENGTH = 2

  it('Debería de devolver 200 en statusCode', function () {
    expect(response.statusCode).to.be.equal(200)
  })

  it('Debería de volver un objeto con una estructura determinada', function () {
    const body = JSON.parse(response.body)

    expect(body).to.have.property('contributors')
    expect(body.contributors).to.have.length(CONT_LENGTH)

    for (let i = 0; i < body.contributors.length; i++) {
      expect(body.contributors[i]).to.have.property('name', data.contributors[i].name)
      expect(body.contributors[i]).to.have.property('reason', data.contributors[i].reason)
    }
  })
})

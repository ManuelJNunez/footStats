import handler from '../functions/league'
import { expect } from 'chai'

describe('Tests del handler de league.js', async function () {
  const response = await handler.handler({ httpMethod: 'GET' })
  const TABLE_LENGTH = 20

  it('Debería de devolver 200 en statusCode', function () {
    expect(response.statusCode).to.be.equal(200)
  })

  it('Debería de volver un objeto con una estructura determinada', function () {
    const body = JSON.parse(response.body)

    expect(body).to.have.property('table')
    expect(body.table).to.have.length(TABLE_LENGTH)

    for (const team of body.table) {
      expect(team).to.have.property('teamName')
      expect(team).to.have.property('rank')
      expect(team).to.have.property('points')
    }
  })
})

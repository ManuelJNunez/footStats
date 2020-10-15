import { expect } from 'chai'
import { Usuario } from '../src/models/usuario.model'

describe('Tests de construcción y alteación de objeto Usuario', function () {
  const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234')

  it('Debería de crearse un objeto Usuario con los valores que se le han pasado', function () {
    expect(usuario.id).to.be.equal(0)
    expect(usuario.nombre).to.be.equal('Manuel')
    expect(usuario.email).to.be.equal('manueljesusnunezruiz@gmail.com')
    expect(usuario.password).to.be.equal('1234')
    expect(usuario.partidos).to.have.lengthOf(0)
  })

  it('Debería de alterar correctamente los datos del usuario', function () {
    usuario.password = '12345'

    expect(usuario.password).to.be.equal('12345')
  })
})

describe('Tests para añadir/eliminar partidos a un Usuario', function () {
  const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234')
  const horaIni = new Date(2020, 10, 14, 18)
  const horaFin = new Date(2020, 10, 14, 18, 45)

  it('Debería añadir un nuevo objeto al array de partidos del usuario', function () {
    usuario.addPartido(horaIni, horaFin)

    expect(usuario.partidos).to.have.lengthOf(1)
  })

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(usuario.partidos[0].horaIni).to.be.equal(horaIni)
    expect(usuario.partidos[0].horaFin).to.be.equal(horaFin)
    expect(usuario.partidos[0].usuario).to.be.equal(usuario)
    expect(usuario.partidos[0].jugadas).to.have.lengthOf(0)
  })

  it('Debería de eliminarse un partido de forma correcta', function () {
    const eliminado = usuario.removePartido(usuario.partidos[0])

    expect(eliminado).to.be.equal(true)
    expect(usuario.partidos).to.have.lengthOf(0)
  })

  it('No debería de eliminar nada', function () {
    const eliminado = usuario.removePartido(usuario.partidos[0])

    expect(eliminado).to.be.equal(false)
  })
})

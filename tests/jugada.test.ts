import { Jugada, TipoJugada, Resultado } from '../src/models/jugada.model'
import { Usuario } from '../src/models/usuario.model'
import { Partido } from '../src/models/partido.model'
import { expect } from 'chai'

const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234')
const horaIni = new Date(2020, 9, 14, 18)
const horaFin = new Date(2020, 9, 14, 18, 45)
const partido = new Partido(horaIni, horaFin, usuario)

describe('Test de construcción y alteración del objeto de Jugada', function () {
  const momento = new Date(horaIni.getDate() + 2)
  const tipo = TipoJugada.Ataque
  const result = Resultado.Fallido
  const comentario = 'Número 11 falló el tiro'

  const jugada = new Jugada(momento, tipo, result, partido, comentario)

  it('Debería de construir de forma correcta un objeto Jugada', function () {
    expect(jugada.id).to.be.equal(0)
    expect(jugada.momento).to.be.equal(momento)
    expect(jugada.tipo).to.be.equal(tipo)
    expect(jugada.resultado).to.be.equal(result)
    expect(jugada.partido).to.be.equal(partido)
    expect(jugada.comentario).to.be.equal(comentario)
  })

  it('Debería de alterar el objeto usando los getters y setters', function () {
    const newResult = Resultado.Fallido
    const newTipo = TipoJugada.Defensa
    const newMomento = new Date(horaIni.getDate() + 5)
    const newComentario = 'Este comentario es nuevo'

    jugada.resultado = newResult
    jugada.momento = newMomento
    jugada.tipo = newTipo
    jugada.comentario = newComentario

    expect(jugada.resultado).to.be.equal(newResult)
    expect(jugada.momento).to.be.equal(newMomento)
    expect(jugada.tipo).to.be.equal(newTipo)
    expect(jugada.comentario).to.be.equal(newComentario)
  })
})

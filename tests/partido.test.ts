import { expect } from 'chai'
import { Usuario } from '../src/models/usuario.model'
import { Partido, Tipo, Resultado } from '../src/models/partido.model'

const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234')
const horaIni = new Date(2020, 9, 14, 18)
const horaFin = new Date(2020, 9, 14, 18, 45)
const partido = new Partido(horaIni, horaFin, usuario)

describe('Tests de construcción y alteración del objeto Partido', function () {
  it('Debería construir de forma correcta el objeto Partido', function () {
    expect(partido.horaIni).to.be.equal(horaIni)
    expect(partido.horaFin).to.be.equal(horaFin)
    expect(partido.jugadas).to.have.lengthOf(0)
    expect(partido.usuario).to.be.equal(usuario)
  })

  it('Debería actualizar el valor de la variable correctamente', function () {
    const nuevaFecha = new Date(2020, 9, 14, 17, 50)

    partido.horaIni = nuevaFecha

    expect(partido.horaIni).to.be.equal(nuevaFecha)
  })

  it('Debería de lanzar una excepción', function () {
    expect(() => new Partido(horaFin, horaIni, usuario)).to.throw('Hora de inicio mayor que hora de fin')
  })
})

describe('Tests para añadir/eliminar jugadas de un partido', function () {
  const jugada = {
    momento: new Date(2020, 9, 14, 18, 10),
    jugada: Tipo.Ataque,
    resultado: Resultado.Acertado,
    comentario: 'El número 12 ha fallado un tiro desde fuera del área'
  }

  it('Debería de añadir una nueva jugada al partido', function () {
    partido.addJugada(jugada)

    expect(partido.jugadas).to.have.lengthOf(1)
  })

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(partido.jugadas[0].momento).to.be.equal(jugada.momento)
    expect(partido.jugadas[0].jugada).to.be.equal(jugada.jugada)
    expect(partido.jugadas[0].resultado).to.be.equal(jugada.resultado)
    expect(partido.jugadas[0].comentario).to.be.equal(jugada.comentario)
  })

  it('Debería de eliminarse la jugada del partido', function () {
    const eliminado = partido.removeJugada(jugada)

    expect(eliminado).to.be.equal(true)
    expect(partido.jugadas).to.have.lengthOf(0)
  })

  it('No debería de eliminar nada', function () {
    const eliminado = partido.removeJugada(jugada)

    expect(eliminado).to.be.equal(false)
  })

  it('Debería lanzar excepción por introducir valor no correcto', function () {
    const jugadaIncorrecta = {
      momento: new Date(Date.now()),
      jugada: Tipo.Ataque,
      resultado: Resultado.Acertado,
      comentario: 'El número 12 ha fallado un tiro desde fuera del área'
    }

    expect(partido.addJugada.bind(partido, jugadaIncorrecta)).to.throw('La jugada debe de suceder antes del fin del partido y después del inicio.')
  })
})

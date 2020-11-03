import { expect } from 'chai'
import { Usuario } from '../src/models/usuario.model'
import { Partido } from '../src/models/partido.model'
import { TipoJugada, Resultado, Jugada } from '../src/models/jugada.model'

const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234')
const horaIni = new Date(2020, 9, 14, 18)
const horaFin = new Date(2020, 9, 14, 18, 45)
const partido = new Partido(horaIni, horaFin, usuario)

describe('Tests de construcción y alteración del objeto Partido', function () {
  it('Debería construir de forma correcta el objeto Partido', function () {
    expect(partido.id).to.be.equal(0);
    expect(partido.horaIni).to.be.equal(horaIni)
    expect(partido.horaFin).to.be.equal(horaFin)
    expect(partido.jugadas).to.have.lengthOf(0)
    expect(partido.usuario).to.be.equal(usuario)
  })

  it('Debería actualizar el valor de las variables correctamente', function () {
    const nuevaFechaIni = new Date(2020, 9, 14, 17, 50)
    const nuevaFechaFin = new Date(2020, 9, 14, 19, 0)

    partido.horaIni = nuevaFechaIni
    partido.horaFin = nuevaFechaFin

    expect(partido.horaIni).to.be.equal(nuevaFechaIni)
  })

  it('Debería de lanzar una excepción', function () {
    expect(() => new Partido(horaFin, horaIni, usuario)).to.throw('Hora de inicio mayor que hora de fin')
  })
})

describe('Tests para añadir/eliminar jugadas de un partido', function () {
  const jugada = new Jugada(new Date(2020, 9, 14, 18, 10), TipoJugada.Ataque, Resultado.Acertado, partido, 'El número 12 ha fallado un tiro desde fuera del área')

  it('Debería de añadir una nueva jugada al partido', function () {
    partido.addJugada(jugada)

    expect(partido.jugadas).to.have.lengthOf(1)
  })

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(partido.jugadas[0].momento).to.be.equal(jugada.momento)
    expect(partido.jugadas[0].tipo).to.be.equal(jugada.tipo)
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
    const jugadaIncorrecta = new Jugada(new Date(Date.now()), TipoJugada.Ataque, Resultado.Acertado, partido, 'El número 12 ha fallado un tiro desde fuera del área')

    expect(partido.addJugada.bind(partido, jugadaIncorrecta)).to.throw('La jugada debe de suceder antes del fin del partido y después del inicio.')
  })
})

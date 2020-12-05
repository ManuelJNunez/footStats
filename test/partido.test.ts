import { expect } from 'chai';
import { Partido } from '../src/partido/partido.entity';
import { TipoJugada, Resultado, Jugada } from '../src/jugada/jugada.entity';

const horaIni = new Date(2020, 9, 14, 18);
const horaFin = new Date(2020, 9, 14, 18, 45);
const partido = new Partido(horaIni, horaFin);

const jugada = new Jugada(
  new Date(2020, 9, 14, 18, 10),
  TipoJugada.Ataque,
  Resultado.Acertado,
  'El número 12 ha fallado un tiro desde fuera del área',
);

describe('Tests de construcción y alteración del objeto Partido', function () {
  it('Debería construir de forma correcta el objeto Partido', function () {
    expect(partido.id).to.be.equal(0);
    expect(partido.horaIni).to.be.equal(horaIni);
    expect(partido.horaFin).to.be.equal(horaFin);
    expect(partido.jugadas).to.have.lengthOf(0);
  });

  it('Debería actualizar el valor de las variables correctamente', function () {
    const nuevaFechaIni = new Date(2020, 9, 14, 17, 50);
    const nuevaFechaFin = new Date(2020, 9, 14, 19, 0);

    partido.horaIni = nuevaFechaIni;
    partido.horaFin = nuevaFechaFin;

    expect(partido.horaIni).to.be.equal(nuevaFechaIni);
  });

  it('Debería de lanzar una excepción', function () {
    expect(() => new Partido(horaFin, horaIni)).to.throw(
      'Hora de inicio mayor que hora de fin',
    );
  });
});

describe('Tests para añadir/eliminar jugadas de un partido', function () {
  it('Debería de añadir una nueva jugada al partido', function () {
    partido.addJugada(jugada);

    expect(partido.jugadas).to.have.lengthOf(1);
  });

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(partido.jugadas[0].momento).to.be.equal(jugada.momento);
    expect(partido.jugadas[0].tipo).to.be.equal(jugada.tipo);
    expect(partido.jugadas[0].resultado).to.be.equal(jugada.resultado);
    expect(partido.jugadas[0].comentario).to.be.equal(jugada.comentario);
  });

  it('Debería de eliminarse la jugada del partido', function () {
    const eliminado = partido.removeJugada(jugada);

    expect(eliminado).to.be.equal(true);
    expect(partido.jugadas).to.have.lengthOf(0);
  });

  it('No debería de eliminar nada', function () {
    const eliminado = partido.removeJugada(jugada);

    expect(eliminado).to.be.equal(false);
  });

  it('Debería lanzar excepción por introducir valor no correcto', function () {
    const jugadaIncorrecta = new Jugada(
      new Date(Date.now()),
      TipoJugada.Ataque,
      Resultado.Acertado,
      'El número 12 ha fallado un tiro desde fuera del área',
    );

    expect(partido.addJugada.bind(partido, jugadaIncorrecta)).to.throw(
      'La jugada debe de suceder antes del fin del partido y después del inicio.',
    );
  });
});

describe('Tests del toJSON de la clase Partido', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    partido.addJugada(jugada);

    const partidojson = partido.toJSON();

    expect(partidojson.id).to.be.equal(partido.id);
    expect(partidojson.horaIni).to.be.equal(partido.horaIni);
    expect(partidojson.horaFin).to.be.equal(partido.horaFin);
    expect(partidojson.jugadas).to.have.length(partido.jugadas.length);
  });
});

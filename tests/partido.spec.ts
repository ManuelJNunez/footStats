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
    expect(partido.id).toEqual(0);
    expect(partido.horaIni).toEqual(horaIni);
    expect(partido.horaFin).toEqual(horaFin);
    expect(partido.jugadas).toHaveLength(0);
  });

  it('Debería actualizar el valor de las variables correctamente', function () {
    const nuevaFechaIni = new Date(2020, 9, 14, 17, 50);
    const nuevaFechaFin = new Date(2020, 9, 14, 19, 0);

    partido.horaIni = nuevaFechaIni;
    partido.horaFin = nuevaFechaFin;

    expect(partido.horaIni).toEqual(nuevaFechaIni);
  });

  it('Debería de lanzar una excepción', function () {
    expect(() => new Partido(horaFin, horaIni)).toThrow(
      'Hora de inicio mayor que hora de fin',
    );
  });
});

describe('Tests para añadir/eliminar jugadas de un partido', function () {
  it('Debería de añadir una nueva jugada al partido', function () {
    partido.addJugada(jugada);

    expect(partido.jugadas).toHaveLength(1);
  });

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(partido.jugadas[0].momento).toEqual(jugada.momento);
    expect(partido.jugadas[0].tipo).toEqual(jugada.tipo);
    expect(partido.jugadas[0].resultado).toEqual(jugada.resultado);
    expect(partido.jugadas[0].comentario).toEqual(jugada.comentario);
  });

  it('Debería de eliminarse la jugada del partido', function () {
    const eliminado = partido.removeJugada(jugada);

    expect(eliminado).toEqual(true);
    expect(partido.jugadas).toHaveLength(0);
  });

  it('No debería de eliminar nada', function () {
    const eliminado = partido.removeJugada(jugada);

    expect(eliminado).toEqual(false);
  });

  it('Debería lanzar excepción por introducir valor no correcto', function () {
    const jugadaIncorrecta = new Jugada(
      new Date(Date.now()),
      TipoJugada.Ataque,
      Resultado.Acertado,
      'El número 12 ha fallado un tiro desde fuera del área',
    );

    expect(partido.addJugada.bind(partido, jugadaIncorrecta)).toThrow(
      'La jugada debe de suceder antes del fin del partido y después del inicio.',
    );
  });
});

describe('Tests del toJSON de la clase Partido', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    partido.addJugada(jugada);

    const partidojson = partido.toJSON();

    expect(partidojson.id).toEqual(partido.id);
    expect(partidojson.horaIni).toEqual(partido.horaIni);
    expect(partidojson.horaFin).toEqual(partido.horaFin);
    expect(partidojson.jugadas).toHaveLength(partido.jugadas.length);
  });
});

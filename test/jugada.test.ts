import { Jugada, TipoJugada, Resultado } from '../src/jugada/jugada.entity';

const momento = new Date();
const tipo = TipoJugada.Ataque;
const result = Resultado.Fallido;
const comentario = 'Número 11 falló el tiro';

const jugada = new Jugada(momento, tipo, result, comentario);

describe('Test de construcción y alteración del objeto de Jugada', function () {
  it('Debería de construir de forma correcta un objeto Jugada', function () {
    expect(jugada.id).toEqual(0);
    expect(jugada.momento).toEqual(momento);
    expect(jugada.tipo).toEqual(tipo);
    expect(jugada.resultado).toEqual(result);
    expect(jugada.comentario).toEqual(comentario);
  });

  it('Debería de alterar el objeto usando los getters y setters', function () {
    const newResult = Resultado.Fallido;
    const newTipo = TipoJugada.Defensa;
    const newMomento = new Date(Date.now());
    const newComentario = 'Este comentario es nuevo';

    jugada.resultado = newResult;
    jugada.momento = newMomento;
    jugada.tipo = newTipo;
    jugada.comentario = newComentario;

    expect(jugada.resultado).toEqual(newResult);
    expect(jugada.momento).toEqual(newMomento);
    expect(jugada.tipo).toEqual(newTipo);
    expect(jugada.comentario).toEqual(newComentario);
  });
});

describe('Tests del toJSON de la clase Jugada', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    const jugadajson = jugada.toJSON();

    expect(jugadajson.id).toEqual(jugada.id);
    expect(jugadajson.momento).toEqual(jugada.momento);
    expect(jugadajson.tipo).toEqual(jugada.tipo);
    expect(jugadajson.resultado).toEqual(jugada.resultado);
    expect(jugadajson.comentario).toEqual(jugada.comentario);
  });
});

import { Jugada, TipoJugada, Resultado } from '../src/models/jugada.model';
import { Usuario } from '../src/models/usuario.model';
import { expect } from 'chai';

const momento = new Date();
const tipo = TipoJugada.Ataque;
const result = Resultado.Fallido;
const comentario = 'Número 11 falló el tiro';

const jugada = new Jugada(momento, tipo, result, comentario);

describe('Test de construcción y alteración del objeto de Jugada', function () {
  it('Debería de construir de forma correcta un objeto Jugada', function () {
    expect(jugada.id).to.be.equal(0);
    expect(jugada.momento).to.be.equal(momento);
    expect(jugada.tipo).to.be.equal(tipo);
    expect(jugada.resultado).to.be.equal(result);
    expect(jugada.comentario).to.be.equal(comentario);
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

    expect(jugada.resultado).to.be.equal(newResult);
    expect(jugada.momento).to.be.equal(newMomento);
    expect(jugada.tipo).to.be.equal(newTipo);
    expect(jugada.comentario).to.be.equal(newComentario);
  });
});

describe('Tests del toJSON de la clase Jugada', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    const jugadajson = jugada.toJSON();

    expect(jugadajson.id).to.be.equal(jugada.id);
    expect(jugadajson.momento).to.be.equal(jugada.momento);
    expect(jugadajson.tipo).to.be.equal(jugada.tipo);
    expect(jugadajson.resultado).to.be.equal(jugada.resultado);
    expect(jugadajson.comentario).to.be.equal(jugada.comentario);
  });
});

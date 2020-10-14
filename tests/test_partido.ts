import {expect} from "chai";
import {Usuario} from "../src/models/usuario.model";
import {Partido, IJugada, Tipo, Resultado} from "../src/models/partido.model";

let usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234');
const horaIni = new Date(2020, 10, 14, 18);
const horaFin = new Date(2020, 10, 14, 18, 45);
let partido = new Partido(horaIni, horaFin, usuario);

describe('Tests de construcción y alteración del objeto Partido', function(){

    it('Debería construir de forma correcta el objeto Partido', function(){
        expect(partido.horaIni).to.be.equal(horaIni);
        expect(partido.horaFin).to.be.equal(horaFin);
        expect(partido.jugadas).to.have.lengthOf(0);
        expect(partido.usuario).to.be.equal(usuario);
    })

    it('Debería actualizar el valor de la variable correctamente', function(){
        let ahora = Date.now();
        let fechaActual = new Date(ahora);

        partido.horaIni = fechaActual;

        expect(partido.horaIni).to.be.equal(fechaActual);
    })
})

describe('Tests para añadir/eliminar jugadas de un partido', function(){
    let jugada = {
        momento: new Date(),
        jugada: Tipo.Ataque,
        resultado: Resultado.Acertado,
        comentario: 'El número 12 ha fallado un tiro desde fuera del área'
    }

    it('Debería de añadir una nueva jugada al partido', function(){
        partido.addJugada(jugada);

        expect(partido.jugadas).to.have.lengthOf(1);
    })

    it('Debería de tener los parámetros inicializados de manera correcta', function(){
        expect(partido.jugadas[0].momento).to.be.equal(jugada.momento);
        expect(partido.jugadas[0].jugada).to.be.equal(jugada.jugada);
        expect(partido.jugadas[0].resultado).to.be.equal(jugada.resultado);
        expect(partido.jugadas[0].comentario).to.be.equal(jugada.comentario);
    })

    it('Debería de eliminarse la jugada del partido', function(){
        let eliminado = partido.removeJugada(jugada);

        expect(eliminado).to.be.equal(true);
        expect(partido.jugadas).to.have.lengthOf(0);
    })

    it('No debería de eliminar nada', function(){
        let eliminado = partido.removeJugada(jugada);

        expect(eliminado).to.be.equal(false);
    })
})


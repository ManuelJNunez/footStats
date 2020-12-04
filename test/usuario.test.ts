import { expect } from 'chai';
import { Usuario } from '../src/models/usuario.model';

const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', '1234');

const newPass = '12345';
const newName = 'Manolo';
const newEmail = 'mjnunez@correo.ugr.es';

const horaIni = new Date(2020, 10, 14, 18);
const horaFin = new Date(2020, 10, 14, 18, 45);

describe('Tests de construcción y alteración de objeto Usuario', function () {
  it('Debería de crearse un objeto Usuario con los valores que se le han pasado', function () {
    expect(usuario.id).to.be.equal(0);
    expect(usuario.nombre).to.be.equal('Manuel');
    expect(usuario.email).to.be.equal('manueljesusnunezruiz@gmail.com');
    expect(usuario.password).to.be.equal('1234');
    expect(usuario.partidos).to.have.lengthOf(0);
  });

  it('Debería de alterar correctamente los datos del usuario a través de los getters y setters', function () {
    usuario.password = newPass;
    usuario.nombre = newName;
    usuario.email = newEmail;

    expect(usuario.password).to.be.equal(newPass);
    expect(usuario.nombre).to.be.equal(newName);
    expect(usuario.email).to.be.equal(newEmail);
  });
});

describe('Tests para añadir/eliminar partidos a un Usuario', function () {
  it('Debería añadir un nuevo objeto al array de partidos del usuario', function () {
    usuario.addPartido(horaIni, horaFin);

    expect(usuario.partidos).to.have.lengthOf(1);
  });

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(usuario.partidos[0].horaIni).to.be.equal(horaIni);
    expect(usuario.partidos[0].horaFin).to.be.equal(horaFin);
    expect(usuario.partidos[0].jugadas).to.have.lengthOf(0);
  });

  it('Debería de eliminarse un partido de forma correcta', function () {
    const eliminado = usuario.removePartido(usuario.partidos[0]);

    expect(eliminado).to.be.equal(true);
    expect(usuario.partidos).to.have.lengthOf(0);
  });

  it('No debería de eliminar nada', function () {
    const eliminado = usuario.removePartido(usuario.partidos[0]);

    expect(eliminado).to.be.equal(false);
  });
});

describe('Tests del toJSON de la clase Usuario', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    usuario.addPartido(horaIni, horaFin);

    const usuariojson = usuario.toJSON();

    expect(usuariojson.id).to.be.equal(usuario.id);
    expect(usuariojson.nombre).to.be.equal(usuario.nombre);
    expect(usuariojson.email).to.be.equal(usuario.email);
    expect(usuariojson).to.not.have.property('password');
    expect(usuariojson.partidos).to.have.length(usuario.partidos.length);
  });
});

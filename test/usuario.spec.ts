import { userInfo } from 'os';
import { CreateUserDTO } from 'src/usuario/dto/create-user.dto';
import { Usuario } from '../src/usuario/usuario.entity';

const pass = '1234';
const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', pass);

const newPass = '12345';
const newName = 'Manolo';
const newEmail = 'mjnunez@correo.ugr.es';

const horaIni = new Date(2020, 10, 14, 18);
const horaFin = new Date(2020, 10, 14, 18, 45);

describe('Tests de construcción y alteración de objeto Usuario', function () {
  it('Debería de crearse un objeto Usuario con los valores que se le han pasado', function () {
    expect(usuario.id).toEqual(0);
    expect(usuario.nickname).toEqual('Manuel');
    expect(usuario.email).toEqual('manueljesusnunezruiz@gmail.com');
    expect(usuario.password).toEqual('1234');
    expect(usuario.partidos).toHaveLength(0);
  });

  it('Debería crear un nuevo objeto con el Dto', () => {
    const userDto = {
      nickname: 'mjnunez',
      email: 'manueljesusnunezruiz@gmail.com',
      password: '1234',
    } as CreateUserDTO;
    const id = 0;

    const user = Usuario.create(userDto, id);

    expect(user.id).toEqual(id);
    expect(user.nickname).toEqual(userDto.nickname);
    expect(user.email).toEqual(userDto.email);
    expect(user.password).toEqual(userDto.password);
    expect(user.partidos).toHaveLength(0);
  });

  it('Debería de alterar correctamente los datos del usuario a través de los getters y setters', function () {
    usuario.password = newPass;
    usuario.nickname = newName;
    usuario.email = newEmail;

    expect(usuario.password).toEqual(newPass);
    expect(usuario.nickname).toEqual(newName);
    expect(usuario.email).toEqual(newEmail);
  });
});

describe('Tests para añadir/eliminar partidos a un Usuario', function () {
  it('Debería añadir un nuevo objeto al array de partidos del usuario', function () {
    usuario.addPartido(horaIni, horaFin);

    expect(usuario.partidos).toHaveLength(1);
  });

  it('Debería de tener los parámetros inicializados de manera correcta', function () {
    expect(usuario.partidos[0].horaIni).toEqual(horaIni);
    expect(usuario.partidos[0].horaFin).toEqual(horaFin);
    expect(usuario.partidos[0].jugadas).toHaveLength(0);
  });

  it('Debería de eliminarse un partido de forma correcta', function () {
    const eliminado = usuario.removePartido(usuario.partidos[0]);

    expect(eliminado).toEqual(true);
    expect(usuario.partidos).toHaveLength(0);
  });

  it('No debería de eliminar nada', function () {
    const eliminado = usuario.removePartido(usuario.partidos[0]);

    expect(eliminado).toEqual(false);
  });
});

describe('Tests del toJSON de la clase Usuario', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    usuario.addPartido(horaIni, horaFin);

    const usuariojson = usuario.toJSON();

    expect(usuariojson.id).toEqual(usuario.id);
    expect(usuariojson.nickname).toEqual(usuario.nickname);
    expect(usuariojson.email).toEqual(usuario.email);
    expect(usuariojson).not.toHaveProperty('password');
  });
});

describe('Test del método validarPassword', function () {
  it('Debería de devolver true', function () {
    const result = usuario.validarPassword(newPass);

    expect(result).toBe(true);
  });

  it('Debería de devolver false', function () {
    const result = usuario.validarPassword(pass);

    expect(result).toBe(false);
  });
});

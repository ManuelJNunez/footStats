import { CreateUserDTO } from 'src/usuario/dto/create-user.dto';
import { Usuario } from '../src/usuario/usuario.entity';
const bcrypt = require('bcrypt');

const pass = '1234';
const usuario = new Usuario('Manuel', 'manueljesusnunezruiz@gmail.com', pass);

const newPass = '12345';
const newName = 'Manolo';
const newEmail = 'mjnunez@correo.ugr.es';

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

describe('Tests del toJSON de la clase Usuario', function () {
  it('Debería de devolver el objeto JSON con la información del usuario', function () {
    const usuariojson = usuario.toJSON();

    expect(usuariojson.userId).toEqual(usuario.id);
    expect(usuariojson.nickname).toEqual(usuario.nickname);
    expect(usuariojson.email).toEqual(usuario.email);
    expect(usuariojson).not.toHaveProperty('password');
  });
});

describe('Test del método validarPassword', function (): void {
  let mockCompare;

  beforeEach(() => {
    mockCompare = jest.spyOn(bcrypt, 'compareSync');
  });

  afterEach(() => {
    mockCompare.mockClear();
  });

  it('Debería de devolver true', function () {
    mockCompare.mockReturnValueOnce(true);

    const result = usuario.validarPassword(newPass);

    expect(result).toBe(true);
    expect(mockCompare).toHaveBeenCalledTimes(1);
    expect(mockCompare).toHaveBeenCalledWith(newPass, usuario.password);
  });

  it('Debería de devolver false', function () {
    mockCompare.mockReturnValueOnce(false);

    const result = usuario.validarPassword(pass);

    expect(result).toBe(false);
    expect(mockCompare).toHaveBeenCalledTimes(1);
    expect(mockCompare).toHaveBeenCalledWith(pass, usuario.password);
  });
});

describe('Tests del método fromJSON', () => {
  it('should create an object from a JSON', () => {
    const newUser = {
      nickname: 'mjnunez',
      email: 'manueljesusnunezruiz@gmail.com',
      password: '1234',
      userId: 0,
    };

    const createdUser = Usuario.fromJSON(newUser);

    expect(createdUser.id).toBe(newUser.userId);
    expect(createdUser.nickname).toEqual(newUser.nickname);
    expect(createdUser.email).toEqual(newUser.email);
    expect(createdUser.password).toEqual(newUser.password);
  });

  it('should create an object from a JSON without a password', () => {
    const newUser = {
      nickname: 'mjnunez',
      email: 'manueljesusnunezruiz@gmail.com',
      userId: 0,
    };

    const createdUser = Usuario.fromJSON(newUser);

    expect(createdUser.id).toBe(newUser.userId);
    expect(createdUser.nickname).toEqual(newUser.nickname);
    expect(createdUser.email).toEqual(newUser.email);
    expect(createdUser.password).toEqual('');
  });
});

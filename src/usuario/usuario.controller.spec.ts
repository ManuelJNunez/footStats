import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
const jwt = require('jsonwebtoken');

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const userObj = {
    id: 0,
    email: 'manueljesusnunezruiz@gmail.com',
    password: '1234',
    nickname: 'mjnunez',
  } as Usuario;

  const userDto = {
    email: 'mjnunez@gmail.com',
    password: '1234',
    nickname: 'manuel',
  } as CreateUserDTO;

  const loginDto = {
    email: 'mjnunez@gmail.com',
    password: '1234',
  } as LoginDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    controller = module.get<UsuarioController>(UsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should retrieve the result of findByEmail', () => {
    const token = 'aValidToken';
    const spyJwt = jest.spyOn(jwt, 'decode');
    spyJwt.mockReturnValueOnce(userObj);
    const spy = jest.spyOn(service, 'findByEmail');
    spy.mockReturnValueOnce(userObj);

    const user = controller.getUser(`Bearer ${token}`);

    expect(user).toEqual(userObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, { json: true });
  });

  it('should retrieve the result of create', () => {
    const spy = jest.spyOn(service, 'create');
    spy.mockReturnValueOnce(userObj);

    const res = controller.createUser(userDto);

    expect(res.message).toEqual('Usuario registrado con éxito');
    expect(res.user).toEqual(userObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userDto);
  });

  it('should retrieve the result of update', () => {
    const id = 0;
    const token = 'aValidToken';
    const spyJwt = jest.spyOn(jwt, 'decode');
    spyJwt.mockClear();
    spyJwt.mockReturnValueOnce(userObj);
    const spy = jest.spyOn(service, 'update');
    spy.mockReturnValueOnce(userObj);

    const res = controller.updateUser(`Bearer ${token}`, userDto);

    expect(res.message).toEqual('Usuario modificado con éxito');
    expect(res.user).toEqual(userObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(id, userDto);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, { json: true });
  });

  it('should retrieve the result of update', () => {
    const id = 0;
    const spy = jest.spyOn(service, 'delete');
    spy.mockReturnValueOnce(userObj);

    const res = controller.deleteUser(id);

    expect(res.message).toEqual('Usuario eliminado con éxito');
    expect(res.user).toEqual(userObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should retrieve an object with the token', () => {
    const token = 'ThisTokenIsValid';
    const spy = jest.spyOn(service, 'generarToken');
    spy.mockReturnValueOnce(token);

    const res = controller.login(loginDto);

    expect(res.message).toEqual('Logeado con éxito');
    expect(res.token).toEqual(token);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(loginDto);
  });
});

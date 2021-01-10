import { Test, TestingModule } from '@nestjs/testing';
import { PgModule } from '../pg/pg.module';
import { EtcdService } from '../etcd/etcd.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioI } from './interfaces/usuario.interface';
import { UnauthorizedException } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
const jwt = require('jsonwebtoken');

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;
  let spyJwt;
  const id = 0;
  const wrongId = 1;

  const userObj = {
    id: 0,
    email: 'manueljesusnunezruiz@gmail.com',
    password: '1234',
    nickname: 'mjnunez',
  } as Usuario;

  const userJson = {
    userId: 0,
    email: 'manueljesusnunezruiz@gmail.com',
    nickname: 'mjnunez',
  } as UsuarioI;

  const userDto = {
    email: 'mjnunez@gmail.com',
    password: '1234',
    nickname: 'manuel',
  } as CreateUserDTO;

  const loginDto = {
    email: 'mjnunez@gmail.com',
    password: '1234',
  } as LoginDTO;

  const token = 'aValidToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PgModule],
      controllers: [UsuarioController],
      providers: [UsuarioService, EtcdService, PgService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    controller = module.get<UsuarioController>(UsuarioController);

    spyJwt = jest.spyOn(jwt, 'decode');
    spyJwt.mockReturnValueOnce(userJson);
  });

  afterEach(async () => {
    spyJwt.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should retrieve the result of findByEmail', async () => {
    const token = 'aValidToken';
    const spy = jest.spyOn(service, 'findByEmail');
    spy.mockResolvedValueOnce(userObj);

    const user = await controller.getUser(`Bearer ${token}`, id);

    expect(user).toEqual(userObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, { json: true });
  });

  it('should throw an exception (get)', async () => {
    async function unauthorized() {
      await controller.getUser(`Bearer ${token}`, wrongId);
    }

    expect(unauthorized).rejects.toThrow(UnauthorizedException);
  });

  it('should retrieve the result of create', async () => {
    const spy = jest.spyOn(service, 'create');
    spy.mockResolvedValueOnce(userJson);

    const res = await controller.createUser(userDto);

    expect(res.message).toEqual('Usuario registrado con éxito');
    expect(res.user).toEqual(userJson);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userDto);
  });

  it('should retrieve the result of update', async () => {
    const spy = jest.spyOn(service, 'update');
    spy.mockResolvedValueOnce(userJson);

    const res = await controller.updateUser(`Bearer ${token}`, userDto, id);

    expect(res.message).toEqual('Usuario modificado con éxito');
    expect(res.user).toEqual(userJson);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userObj.id, userDto);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, { json: true });
  });

  it('should throw an exception (put)', async () => {
    async function unauthorized() {
      await controller.updateUser(`Bearer ${token}`, userDto, wrongId);
    }

    expect(unauthorized).rejects.toThrow(UnauthorizedException);
  });

  it('should retrieve the result of delete', async () => {
    const spy = jest.spyOn(service, 'delete');
    spy.mockResolvedValueOnce(userObj);

    const res = await controller.deleteUser(`Bearer ${token}`, id);

    expect(res.message).toEqual('Usuario eliminado con éxito');
    expect(res.user).toEqual(userObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userObj.id);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, { json: true });
  });

  it('should throw an exception (delete)', async () => {
    async function unauthorized() {
      await controller.deleteUser(`Bearer ${token}`, wrongId);
    }

    expect(unauthorized).rejects.toThrow(UnauthorizedException);
  });

  it('should retrieve an object with the token', async () => {
    const token = 'ThisTokenIsValid';
    const spy = jest.spyOn(service, 'generarToken');
    spy.mockResolvedValueOnce(token);

    const res = await controller.login(loginDto);

    expect(res.message).toEqual('Logeado con éxito');
    expect(res.token).toEqual(token);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(loginDto);
  });
});

import { HttpException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsuarioService } from './usuario.service';
import { LoginDTO } from './dto/login.dto';
const jwt = require('jsonwebtoken');
import { Pool } from 'pg';
import { Usuario } from './usuario.entity';
import { UsuarioI } from './interfaces/usuario.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { PgModule } from '../pg/pg.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
const bcrypt = require('bcrypt');

describe('UsuarioService', () => {
  const passCrypt = 'encryptedPassword:D';
  const rounds = 10;
  let service: UsuarioService;
  let querySpy;
  let mockHash;

  const data = {
    id: 0,
    nickname: 'mjnunez',
    email: 'manueljesusnunezruiz@gmail.com',
    password: '1234',
  };

  const userJson = {
    id: data.id,
    nickname: data.nickname,
    email: data.email,
  };

  const anotherUserJSON = {
    id: data.id,
    nickname: data.nickname,
    password: data.password,
    email: data.email,
  } as UsuarioI;

  const User = ({
    id: data.id,
    nickname: data.nickname,
    password: data.password,
    email: data.email,
    toJSON: jest.fn().mockReturnValueOnce(userJson),
    validarPassword: () => false,
  } as unknown) as Usuario;

  const UserDto = {
    nickname: data.nickname,
    password: data.password,
    email: data.email,
  } as CreateUserDTO;

  const anotherUserDto = {
    nickname: 'manolo',
    password: 'hola',
    email: 'mjnunez@correo.ugr.es',
  } as CreateUserDTO;

  const loginDto = {
    email: 'manueljesusnunezruiz@gmail.com',
    password: '1234',
  } as LoginDTO;

  const incorrectLoginDto = {
    email: 'manueljesusnunezruiz@gmail.com',
    password: 'hola',
  } as LoginDTO;

  const pgService = {
    getPool: jest.fn(() => {
      return new Pool();
    }),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PgModule],
      providers: [UsuarioService, EtcdService, AuthGuard],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    querySpy = Pool.prototype.query = jest.fn();
    mockHash = jest.spyOn(bcrypt, 'hash');
  });

  afterEach(() => {
    querySpy.mockClear();
    mockHash.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new User', async () => {
    jest.mock('./usuario.entity');
    const mockCreate = jest.fn();
    mockCreate.mockReturnValueOnce(User);
    Usuario.create = mockCreate;

    querySpy
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({
        rows: [{ id: userJson.id }],
        rowCount: 1,
      });

    mockHash.mockResolvedValueOnce(passCrypt);

    const newUser = await service.create(UserDto);

    expect(mockHash).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenLastCalledWith(UserDto.password, rounds);
    expect(querySpy).toBeCalledTimes(3);
    expect(querySpy).toHaveBeenNthCalledWith(
      1,
      `SELECT * FROM users WHERE "email" = '${UserDto.email}'`,
    );
    expect(querySpy).toHaveBeenNthCalledWith(
      2,
      `SELECT * FROM users WHERE "nickname" = '${UserDto.nickname}'`,
    );
    expect(querySpy).toHaveBeenNthCalledWith(
      3,
      `INSERT INTO users ("email", "nickname", "password") VALUES ('${UserDto.email}', '${UserDto.nickname}', '${passCrypt}') RETURNING "id"`,
    );
    expect(mockCreate).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(UserDto, userJson.id);
    expect(User.toJSON).toHaveBeenCalled();
    expect(newUser.id).toEqual(userJson.id);
    expect(newUser.email).toEqual(UserDto.email);
    expect(newUser.nickname).toEqual(UserDto.nickname);
    expect(newUser).not.toHaveProperty('password');
  });

  it('should throw HttpException because the email is registered', async () => {
    async function emailException() {
      await service.create(UserDto);
    }

    querySpy.mockResolvedValueOnce({ rowCount: 1 });

    expect(emailException).rejects.toThrow(HttpException);
  });

  it('should throw another HttpException because the nickname is registered', async () => {
    async function ValidationError() {
      await service.create(UserDto);
    }

    querySpy
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rowCount: 1 });

    expect(ValidationError).rejects.toThrow(HttpException);
  });

  it('should retrieve a user with id 0', async () => {
    querySpy.mockResolvedValueOnce({ rows: [anotherUserJSON], rowCount: 1 });

    const mockFromJSON = jest.fn();
    mockFromJSON.mockReturnValueOnce(User);
    Usuario.fromJSON = mockFromJSON;

    const userFound = await service.findById(anotherUserJSON.id);

    expect(userFound).toEqual(User);
    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE "id" = '${anotherUserJSON.id}'`,
    );
    expect(mockFromJSON).toHaveBeenCalledWith(anotherUserJSON);
  });

  it('should throw an error', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    async function notFoundError() {
      await service.findById(2);
    }

    expect(notFoundError).rejects.toThrow(HttpException);
  });

  it('should retrieve a user by his email', async () => {
    querySpy.mockResolvedValueOnce({ rows: [anotherUserJSON], rowCount: 1 });

    const mockFromJSON = jest.fn();
    mockFromJSON.mockReturnValueOnce(User);
    Usuario.fromJSON = mockFromJSON;

    const userFound = await service.findByEmail(anotherUserJSON.email);

    expect(userFound).toEqual(User);
    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE "email" = '${anotherUserJSON.email}'`,
    );
    expect(mockFromJSON).toHaveBeenCalledWith(anotherUserJSON);
  });

  it('should throw an error (not found)', () => {
    querySpy.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    async function notFoundError() {
      await service.findByEmail('idonotexist@gmail.com');
    }

    expect(notFoundError).rejects.toThrow(HttpException);
  });

  it('should update the user', async () => {
    const id = 0;

    const returnedUser = {
      id: id,
      nickname: anotherUserDto.nickname,
      email: anotherUserDto.email,
    };

    querySpy
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({
        rows: [returnedUser],
        rowCount: 1,
      });

    mockHash.mockResolvedValueOnce(passCrypt);

    const updatedUser = await service.update(userJson.id, anotherUserDto);

    expect(mockHash).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenLastCalledWith(anotherUserDto.password, rounds);
    expect(updatedUser).toEqual(returnedUser);
    expect(querySpy).toHaveBeenCalledTimes(3);
    expect(querySpy).toHaveBeenNthCalledWith(
      1,
      `SELECT * FROM users WHERE NOT "id" = '${id}' AND "email" = '${anotherUserDto.email}'`,
    );
    expect(querySpy).toHaveBeenNthCalledWith(
      2,
      `SELECT * FROM users WHERE NOT "id" = '${id}' AND "nickname" = '${anotherUserDto.nickname}'`,
    );
    expect(querySpy).toHaveBeenNthCalledWith(
      3,
      `UPDATE users 
      SET "nickname" = '${anotherUserDto.nickname}', "email" = '${anotherUserDto.email}', "password" = '${passCrypt}'
      WHERE "id" = ${id}
      RETURNING "id", "nickname", "email"`,
    );
  });

  it('should throw an exception because the email is used', async () => {
    async function emailUsed() {
      await service.update(userJson.id, anotherUserDto);
    }

    querySpy.mockResolvedValueOnce({ rowCount: 1 });

    expect(emailUsed).rejects.toThrow(HttpException);
  });

  it('should throw an exception because the nickname is used', async () => {
    async function nicknameUsed() {
      await service.update(userJson.id, anotherUserDto);
    }

    querySpy
      .mockResolvedValueOnce({ rowCount: 0 })
      .mockResolvedValueOnce({ rowCount: 1 });

    expect(nicknameUsed).rejects.toThrow(HttpException);
  });

  it('should delete the user', async () => {
    const returnedUser = {
      id: 0,
      nickname: anotherUserDto.nickname,
      email: anotherUserDto.email,
    };

    querySpy
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [returnedUser], rowCount: 1 });

    const deletedUser = await service.delete(returnedUser.id);

    expect(deletedUser).toEqual(returnedUser);
    expect(querySpy).toHaveBeenCalledWith(
      `DELETE FROM users WHERE "id" = ${returnedUser.id} RETURNING "id", "email", "nickname"`,
    );
  });

  it('should call jwt.sign with some specific parameters', async () => {
    const token = 'aValidToken';
    process.env.JWT_SECRET = 'thisIsSecret';

    const spyFindByEmail = jest.spyOn(service, 'findByEmail');
    const spyValidarPassword = jest.spyOn(User, 'validarPassword');
    const spyJwt = jest.spyOn(jwt, 'sign');

    spyFindByEmail.mockResolvedValueOnce(User);
    spyValidarPassword.mockReturnValueOnce(true);
    spyJwt.mockReturnValueOnce(token);

    const retrievedToken = await service.generarToken(loginDto);

    expect(retrievedToken).toEqual(token);
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyFindByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(spyJwt).toHaveBeenCalledTimes(1);
    expect(spyJwt).toHaveBeenCalledWith(User.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '2h',
    });
  });

  it('should fail because the password is incorrect', async () => {
    async function loginFailed() {
      await service.generarToken(incorrectLoginDto);
    }

    const spyFindByEmail = jest.spyOn(service, 'findByEmail');
    spyFindByEmail.mockResolvedValueOnce(User);

    expect(loginFailed).rejects.toThrow(HttpException);
  });
});

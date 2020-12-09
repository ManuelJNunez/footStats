import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  const UserDto = {
    nickname: 'mjnunez',
    password: '1234',
    email: 'manueljesusnunezruiz@gmail.com',
  } as CreateUserDTO;

  const anotherUserDto = {
    nickname: 'manolo',
    password: '1234',
    email: 'manolo@gmail.com',
  } as CreateUserDTO;

  const userDtoNickError = {
    nickname: 'mjnunez',
    password: '1234',
    email: 'mjnunez@gmail.com',
  } as CreateUserDTO;

  const userDtoEmailError = {
    nickname: 'manuel',
    password: '1234',
    email: 'manueljesusnunezruiz@gmail.com',
  } as CreateUserDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new User', () => {
    const user = service.create(UserDto);

    expect(user.id).toBe(0);
    expect(user.email).toEqual(UserDto.email);
    expect(user.nickname).toEqual(UserDto.nickname);
    expect(user).not.toHaveProperty('password');
  });

  it('should throw HttpException', () => {
    service.create(UserDto);

    function ValidationError() {
      service.create(userDtoNickError);
    }

    expect(ValidationError).toThrow(HttpException);
  });

  it('should throw another HttpException', () => {
    service.create(UserDto);

    function ValidationError() {
      service.create(userDtoEmailError);
    }

    expect(ValidationError).toThrow(HttpException);
  });

  it('should have different IDs', () => {
    const user = service.create(UserDto);
    const anotherUser = service.create(anotherUserDto);

    expect(anotherUser.id).not.toEqual(user.id);
  });

  it('should retrieve a user', () => {
    const user = service.create(UserDto);
    const userFound = service.findById(user.id);

    expect(userFound.id).toEqual(user.id);
  });

  it('should throw an error', () => {
    service.create(UserDto);

    function notFoundError() {
      service.findById(1);
    }

    expect(notFoundError).toThrow(HttpException);
  });

  it('should retrieve a user by his email', () => {
    const user = service.create(UserDto);
    const userFound = service.findByEmail(UserDto.email);

    expect(userFound.email).toBe(user.email);
  });

  it('should throw an error (not found)', () => {
    service.create(UserDto);

    function notFoundError() {
      service.findByEmail('random@gmail.com');
    }

    expect(notFoundError).toThrow(HttpException);
  });

  it('should update the user', () => {
    const user = service.create(UserDto);

    const updatedUser = service.update(user.id, anotherUserDto);

    expect(updatedUser.id).toEqual(user.id);
    expect(updatedUser.email).toEqual(anotherUserDto.email);
    expect(updatedUser.nickname).toEqual(anotherUserDto.nickname);
  });

  it('should throw an error because the user with ID 0 does not exist', () => {
    function itFails() {
      service.update(0, anotherUserDto);
    }

    expect(itFails).toThrow(HttpException);
  });

  it('should throw an error because the email is already used', () => {
    const user = service.create(UserDto);
    const anotherUser = service.create(anotherUserDto);

    function itFails() {
      service.update(anotherUser.id, userDtoEmailError);
    }

    expect(itFails).toThrow(HttpException);
  });

  it('should throw an error because the nickname is already used', () => {
    const user = service.create(UserDto);
    const anotherUser = service.create(anotherUserDto);

    function itFails() {
      service.update(anotherUser.id, userDtoNickError);
    }

    expect(itFails).toThrow(HttpException);
  });

  it('should delete the user', () => {
    const user = service.create(UserDto);

    const deletedUser = service.delete(user.id);

    expect(deletedUser[0].id).toEqual(user.id);
    expect(deletedUser[0].email).toEqual(user.email);
    expect(deletedUser[0].nickname).toEqual(user.nickname);
  });
});

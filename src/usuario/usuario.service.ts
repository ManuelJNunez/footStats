import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Usuario } from './usuario.entity';
import { LoginDTO } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsuarioService {
  private readonly users: Usuario[] = [];
  private id = 0;

  create(user: CreateUserDTO) {
    // Comprobar si el e-mail ya está registrado
    const result = this.users.find((usr) => {
      return usr.email === user.email;
    });

    if (result) {
      const error = { email: 'E-mail ya registrado' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Comprobar si el nickname ya existe
    const result1 = this.users.find((usr) => {
      return usr.nickname === user.nickname;
    });

    if (result1) {
      const error = { nickname: 'Nickname ya registrado' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear nuevo usuario
    const usuario = Usuario.create(user, this.id);
    this.id++;
    this.users.push(usuario);

    return usuario.toJSON();
  }

  findById(id: number) {
    const user = this.users.find((usr) => {
      return usr.id == id;
    });

    if (!user) {
      const error = { message: 'Usuario no registrado' };
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  findByEmail(email: string) {
    const user = this.users.find((usr) => {
      return usr.email === email;
    });

    if (!user) {
      const error = { message: 'Usuario no registrado' };
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  update(id: number, user: CreateUserDTO) {
    // Comprobar si el usuario existe
    const result = this.findById(id);

    // Comprobar si el nuevo e-mail ya está registrado por otro usuario
    const result1 = this.users.find((usr) => {
      return usr.email === user.email && usr.id != id;
    });

    if (result1) {
      const error = { email: 'E-mail ya registrado por otro usuario' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Comprobar si el nuevo nickname ya está registrado por otro usuario
    const result2 = this.users.find((usr) => {
      return usr.nickname === user.nickname && usr.id != id;
    });

    if (result2) {
      const error = { email: 'E-mail ya registrado por otro usuario' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Modificar usuario
    const index = this.users.indexOf(result);

    this.users[index].nickname = user.nickname;
    this.users[index].email = user.email;
    this.users[index].password = user.password;

    return this.users[index].toJSON();
  }

  delete(id: number) {
    const result = this.findById(id);
    const index = this.users.indexOf(result);

    return this.users.splice(index, 1)[0];
  }

  generarToken(loginDto: LoginDTO) {
    const user = this.findByEmail(loginDto.email);

    if (!user.validarPassword(loginDto.password)) {
      throw new HttpException(
        { message: 'Usuario o password incorrectos.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '2h' });
  }
}

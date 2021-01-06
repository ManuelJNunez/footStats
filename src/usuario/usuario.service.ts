import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Usuario } from './usuario.entity';
import { LoginDTO } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class UsuarioService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(user: CreateUserDTO) {
    // Comprobar si el e-mail ya está registrado
    const result = await this.knex
      .select('*')
      .from('users')
      .where('email', user.email);

    if (result.length > 0) {
      const error = { email: 'E-mail ya registrado' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Comprobar si el nickname ya existe
    const result1 = await this.knex
      .select('*')
      .from('users')
      .where('nickname', user.nickname);

    if (result1.length > 0) {
      const error = { nickname: 'Nickname ya registrado' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear nuevo usuario
    const userId = await this.knex('users').insert(user).returning('userId');
    const usuario = Usuario.create(user, userId[0]);

    return usuario.toJSON();
  }

  async findById(id: number) {
    const userJson = await this.knex
      .select('*')
      .from('users')
      .where('userId', id);

    if (userJson.length == 0) {
      const error = { message: 'Usuario no registrado' };
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }

    const user = Usuario.fromJSON(userJson[0]);

    return user[0];
  }

  async findByEmail(email: string) {
    const userJson = await this.knex
      .select('*')
      .from('users')
      .where('email', email);

    if (userJson.length == 0) {
      const error = { message: 'Usuario no registrado' };
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }

    const user = Usuario.fromJSON(userJson[0]);

    return user;
  }

  async update(id: number, user: CreateUserDTO) {
    // Comprobar si el usuario existe
    let result = await this.findById(id);

    // Comprobar si el nuevo e-mail ya está registrado por otro usuario
    const result1 = await this.knex
      .select('*')
      .from('users')
      .whereNot('userId', id)
      .andWhere('email', user.email);

    if (result1.length > 0) {
      const error = { email: 'E-mail ya registrado por otro usuario' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Comprobar si el nuevo nickname ya está registrado por otro usuario
    const result2 = await this.knex
      .select('*')
      .from('users')
      .whereNot('userId', id)
      .andWhere('nickname', user.nickname);

    if (result2.length > 0) {
      const error = { email: 'Nickname ya registrado por otro usuario' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Modificar usuario
    result = await this.knex
      .update(user, ['userId', 'nickname', 'email'])
      .from('users')
      .where('userId', id);

    return result;
  }

  async delete(id: number) {
    const result = await this.knex
      .delete(['userId', 'email', 'nickname'])
      .from('users')
      .where('userId', id);

    return result;
  }

  async generarToken(loginDto: LoginDTO) {
    const user = await this.findByEmail(loginDto.email);

    if (!user.validarPassword(loginDto.password)) {
      throw new HttpException(
        { message: 'email o password incorrectos.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '2h' });
  }
}

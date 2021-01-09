import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Usuario } from './usuario.entity';
import { LoginDTO } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class UsuarioService {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(user: CreateUserDTO) {
    // Comprobar si el e-mail ya está registrado
    const result = await this.pool.query(
      `SELECT * FROM "users" WHERE "email" = '${user.email}'`,
    );

    if (result.rowCount > 0) {
      const error = { email: 'E-mail ya registrado' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Comprobar si el nickname ya existe
    const result1 = await this.pool.query(
      `SELECT * FROM "users" WHERE "nickname" = '${user.nickname}'`,
    );

    if (result1.rowCount > 0) {
      const error = { nickname: 'Nickname ya registrado' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Encriptar password
    const rounds = 10;
    const hash = await bcrypt.hash(user.password, rounds);

    // Crear nuevo usuario
    const userId = await this.pool.query(
      `INSERT INTO "users" ("email", "nickname", "password") VALUES ('${user.email}', '${user.nickname}', '${hash}') RETURNING "userId"`,
    );
    const usuario = Usuario.create(user, userId.rows[0].userId);

    return usuario.toJSON();
  }

  async findById(id: number) {
    const queryResult = await this.pool.query(
      `SELECT * FROM users WHERE "id" = '${id}'`,
    );

    if (queryResult.rowCount === 0) {
      const error = { message: 'Usuario no registrado' };
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }

    const user = Usuario.fromJSON(queryResult.rows[0]);

    return user;
  }

  async findByEmail(email: string) {
    const queryResult = await this.pool.query(
      `SELECT * FROM users WHERE "email" = '${email}'`,
    );

    if (queryResult.rowCount === 0) {
      const error = { message: 'Usuario no registrado' };
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }

    const user = Usuario.fromJSON(queryResult.rows[0]);

    return user;
  }

  async update(id: number, user: CreateUserDTO) {
    // Comprobar si el usuario existe se hace en el AuthGuard

    // Comprobar si el nuevo e-mail ya está registrado por otro usuario
    const result1 = await this.pool.query(
      `SELECT * FROM users WHERE NOT "userId" = '${id}' AND "email" = '${user.email}'`,
    );

    if (result1.rowCount > 0) {
      const error = { email: 'E-mail ya registrado por otro usuario' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Comprobar si el nuevo nickname ya está registrado por otro usuario
    const result2 = await this.pool.query(
      `SELECT * FROM users WHERE NOT "userId" = '${id}' AND "nickname" = '${user.nickname}'`,
    );

    if (result2.rowCount > 0) {
      const error = { email: 'Nickname ya registrado por otro usuario' };
      throw new HttpException(
        { message: 'Error en la validación de los datos', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Encriptar password
    const rounds = 10;
    const hash = await bcrypt.hash(user.password, rounds);

    // Modificar usuario
    const usuario = await this.pool.query(
      `UPDATE users 
      SET "nickname" = '${user.nickname}', "email" = '${user.email}', "password" = '${hash}'
      WHERE "userId" = ${id}
      RETURNING "userId", "nickname", "email"`,
    );

    return usuario.rows[0];
  }

  async delete(id: number) {
    const result = await this.pool.query(
      `DELETE FROM users WHERE "userId" = ${id} RETURNING "userId", "email", "nickname"`,
    );

    return result.rows[0];
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

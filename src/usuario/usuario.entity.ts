// usuario.entity.ts
/**
 * Este módulo contiene la definición de la clase que representa al usuario
 * @packageDocumentation
 */

import { UsuarioI } from './interfaces/usuario.interface';
import { Partido } from '../partido/partido.entity';
import { CreateUserDTO } from './dto/create-user.dto';

/**
 * Clase que representa al usuario
 */
export class Usuario {
  /** Identificador único del usuario */
  private _id: number;

  /**
   * Nombre del usuario
   */
  private _nickname: string;

  /**
   * Dirección de correo electrónico del usuario
   */
  private _email: string;

  /**
   * Contraseña del usuario para el acceso (debe ir encriptada)
   */
  private _password: string;

  /**
   * {@link Partido | Partidos} registrados por el usuario.
   */
  private _partidos: Partido[];

  /**
   * Crea un usuario
   * @param nombre Nombre del nuevo usuario
   * @param email Dirección de correo eléctronico del nuevo usuario
   * @param password Contraseña de acceso del nuevo usuario
   */
  constructor(nombre: string, email: string, password: string, id = 0) {
    this._id = id;
    this._nickname = nombre;
    this._email = email;
    this._password = password;
    this._partidos = [];
  }

  /**
   * Crea un nuevo usuario
   * @param dto Data Transfer Object para la clase Usuario
   * @param id Identificador que se le asignará al Usuario
   * @return Un objeto de la clase usuario creado a partir del DTO
   */
  static create(dto: CreateUserDTO, id: number) {
    return new Usuario(dto.nickname, dto.email, dto.password, id);
  }

  /**
   * @return Identificador único del Usuario
   */
  get id(): number {
    return this._id;
  }

  /**
   * @return Nombre del Usuario
   */
  get nickname(): string {
    return this._nickname;
  }

  /**
   * @param nuevoNombre Nuevo nombre del Usuario
   */
  set nickname(nuevoNombre: string) {
    this._nickname = nuevoNombre;
  }

  /**
   * @return Correo electrónico del usuario
   */
  get email(): string {
    return this._email;
  }

  /**
   * @param nuevoEmail Nuevo correo electrónico del usuario
   */
  set email(nuevoEmail: string) {
    this._email = nuevoEmail;
  }

  /**
   * @return Contraseña del usuario
   */
  get password(): string {
    return this._password;
  }

  /**
   * @param nuevaPass Nueva contraseña del usuario
   */
  set password(nuevaPass: string) {
    this._password = nuevaPass;
  }

  public validarPassword(password: string): boolean {
    return this._password === password;
  }

  /**
   * Añade un nuevo partido al usuario
   * @param horaIni Hora de inicio del partido
   * @param horaFin Hora de fin del partido
   */
  public addPartido(horaIni: Date, horaFin: Date): void {
    this._partidos.push(new Partido(horaIni, horaFin));
  }

  /**
   * Elimina un partido del usuario
   * @param partido Partido que se debe de eliminar
   * @return Si la operación ha tenido éxito o no
   */
  public removePartido(partido: Partido): boolean {
    const index = this._partidos.indexOf(partido);

    if (index > -1) {
      this._partidos.splice(index);
      return true;
    } else {
      return false;
    }
  }

  /**
   * @return Todos los objetos de tipo {@link Partido} registrado por el usuario
   */
  get partidos(): Partido[] {
    return this._partidos;
  }

  toJSON(): UsuarioI {
    const usuario: UsuarioI = {
      userId: this._id,
      nickname: this._nickname,
      email: this._email,
    };

    return usuario;
  }
}

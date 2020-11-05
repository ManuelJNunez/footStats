// usuario.model.ts
/**
 * Este módulo contiene la definición de la clase que representa al usuario
 * @packageDocumentation
 */

import { PartidoI } from '../interfaces/partido.interface'
import { UsuarioI } from '../interfaces/usuario.interface'
import { Partido } from './partido.model'

/**
 * Clase que representa al usuario
 */
export class Usuario {
    /** Identificador único del usuario */
    private _id: number;

    /**
     * Nombre del usuario
     */
    private _nombre: string;

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
    constructor (nombre: string, email: string, password: string) {
      this._id = 0
      this._nombre = nombre
      this._email = email
      this._password = password
      this._partidos = []
    }

    /**
     * @return Identificador único del Usuario
     */
    get id (): number {
      return this._id
    }

    /**
     * @return Nombre del Usuario
     */
    get nombre (): string {
      return this._nombre
    }

    /**
     * @param nuevoNombre Nuevo nombre del Usuario
     */
    set nombre (nuevoNombre: string) {
      this._nombre = nuevoNombre
    }

    /**
     * @return Correo electrónico del usuario
     */
    get email (): string {
      return this._email
    }

    /**
     * @param nuevoEmail Nuevo correo electrónico del usuario
     */
    set email (nuevoEmail: string) {
      this._email = nuevoEmail
    }

    /**
     * @return Contraseña del usuario
     */
    get password (): string {
      return this._password
    }

    /**
     * @param nuevaPass Nueva contraseña del usuario
     */
    set password (nuevaPass: string) {
      this._password = nuevaPass
    }

    /**
     * Añade un nuevo partido al usuario
     * @param horaIni Hora de inicio del partido
     * @param horaFin Hora de fin del partido
     */
    public addPartido (horaIni: Date, horaFin: Date): void {
      this._partidos.push(new Partido(horaIni, horaFin))
    }

    /**
     * Elimina un partido del usuario
     * @param partido Partido que se debe de eliminar
     * @return Si la operación ha tenido éxito o no
     */
    public removePartido (partido: Partido): boolean {
      const index = this._partidos.indexOf(partido)

      if (index > -1) {
        this._partidos.splice(index)
        return true
      } else {
        return false
      }
    }

    /**
     * @return Todos los objetos de tipo {@link Partido} registrado por el usuario
     */
    get partidos (): Partido[] {
      return this._partidos
    }

    toJSON (): UsuarioI {
      const partidos: PartidoI[] = []

      for (const partido of this._partidos) {
        partidos.push(partido)
      }

      const usuario: UsuarioI = {
        id: this._id,
        nombre: this._nombre,
        email: this._email,
        partidos: partidos
      }

      return usuario
    }
}

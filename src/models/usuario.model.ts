// usuario.model.ts
/**
 * Este módulo contiene la definición de la clase que representa al usuario
 * @packageDocumentation
 */

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { Partido } from './partido.model'

/**
 * Clase que representa al usuario
 */
@Entity()
export class Usuario extends BaseEntity {
    /** Identificador único del usuario */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Nombre del usuario
     */
    @Column()
    nombre: string;

    /**
     * Dirección de correo electrónico del usuario
     */
    @Column({ unique: true })
    email: string;

    /**
     * Contraseña del usuario para el acceso (debe ir encriptada)
     */
    @Column({ select: false })
    password: string;

    /**
     * {@link Partido | Partidos} registrados por el usuario.
     */
    @OneToMany(() => Partido, partido => partido.usuario)
    partidos: Partido[];

    /**
     * Crea un usuario
     * @param nombre Nombre del nuevo usuario
     * @param email Dirección de correo eléctronico del nuevo usuario
     * @param password Contraseña de acceso del nuevo usuario
     */
    constructor (nombre: string, email: string, password: string) {
      super()

      this.id = 0
      this.nombre = nombre
      this.email = email
      this.password = password
      this.partidos = []
    }

    /**
     * Añade un nuevo partido al usuario
     * @param horaIni Hora de inicio del partido
     * @param horaFin Hora de fin del partido
     */
    public addPartido (horaIni: Date, horaFin: Date): void {
      this.partidos.push(new Partido(horaIni, horaFin, this))
    }

    /**
     * Elimina un partido del usuario
     * @param partido Partido que se debe de eliminar
     * @returns SI la operación ha tenido éxito o no
     */
    public removePartido (partido: Partido): boolean {
      const index = this.partidos.indexOf(partido)

      if (index > -1) {
        this.partidos.splice(index)
        return true
      } else {
        return false
      }
    }
}

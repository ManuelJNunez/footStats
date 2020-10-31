// partido.model.ts
/**
 * Este módulo contiene la declaración de la clase que representa a los partidos
 * @packageDocumentation
 */

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm'
import { Usuario } from './usuario.model'
import { Jugada } from './jugada.model'

/**
 * Clase que representa los partidos
 */
@Entity()
export class Partido extends BaseEntity {
    /** Identificador único del partido */
    @PrimaryGeneratedColumn()
    id: number;

    /** Hora de inicio del partido */
    @Column()
    horaIni: Date;

    /** Hora de finalización del partido */
    @Column()
    horaFin: Date;

    /** Histórico de jugadas que se han producido en el partido */
    @ManyToOne(() => Jugada, jugada => jugada.partido)
    jugadas: Jugada[];

    /** {@link Usuario} que registró el partido */
    @ManyToOne(() => Usuario, usuario => usuario.partidos)
    usuario: Usuario;

    /**
     * Crea un partido
     * @param horaIni Hora de inicio del partido nuevo
     * @param horaFin Hora de finalización del partido nuevo
     * @param usuario Usuario que ha registrado el partido nuevo
     */
    constructor (horaIni: Date, horaFin: Date, usuario: Usuario) {
      super()

      if (horaIni > horaFin) {
        throw new Error('Hora de inicio mayor que hora de fin')
      }

      this.id = 0
      this.horaIni = horaIni
      this.horaFin = horaFin
      this.jugadas = []
      this.usuario = usuario
    }

    /**
     * Añade una jugada nueva al partido
     * @param jugada Objeto de la clase {@link Jugada} que contiene información sobre la misma
     */
    public addJugada (jugada: Jugada): void {
      if (!(jugada.momento.getTime() >= this.horaIni.getTime() && jugada.momento.getTime() <= this.horaFin.getTime())) {
        throw new Error('La jugada debe de suceder antes del fin del partido y después del inicio.')
      }

      this.jugadas.push(jugada)
    }

    /**
     * Elimina una jugada del partido
     * @param jugada Objeto de la clase {@link Jugada} que queremos eliminar del partido
     * @returns Si la operación tuvo éxito o no
     */
    public removeJugada (jugada: Jugada): boolean {
      const index = this.jugadas.indexOf(jugada)

      if (index > -1) {
        this.jugadas.splice(index)
        return true
      } else {
        return false
      }
    }
}

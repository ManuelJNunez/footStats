// partido.model.ts
/**
 * Este módulo contiene la declaración de la clase que representa a los partidos
 * @packageDocumentation
 */

import { Usuario } from './usuario.model'
import { Jugada } from './jugada.model'

/**
 * Clase que representa los partidos
 */
export class Partido {
    /** Identificador único del partido */
    private _id: number;

    /** Hora de inicio del partido */
    private _horaIni: Date;

    /** Hora de finalización del partido */
    private _horaFin: Date;

    /** Histórico de jugadas que se han producido en el partido */
    private _jugadas: Jugada[];

    /** {@link Usuario} que registró el partido */
    private _usuario: Usuario;

    /**
     * Crea un partido
     * @param horaIni Hora de inicio del partido nuevo
     * @param horaFin Hora de finalización del partido nuevo
     * @param usuario Usuario que ha registrado el partido nuevo
     */
    constructor (horaIni: Date, horaFin: Date, usuario: Usuario) {
      if (horaIni > horaFin) {
        throw new Error('Hora de inicio mayor que hora de fin')
      }

      this._id = 0
      this._horaIni = horaIni
      this._horaFin = horaFin
      this._jugadas = []
      this._usuario = usuario
    }

    /**
     * @returns Identificador único del Partido
     */
    get id (): number {
      return this._id
    }

    /**
     * @returns Hora de inicio del partido
     */
    get horaIni (): Date {
      return this._horaIni
    }

    /**
     * @returns Hora de fin del partido
     */
    get horaFin (): Date {
      return this._horaFin
    }

    /**
     * @returns Contiene objetos del tipo {@link Jugada} que representan las jugadas sucedidas en el partido
     */
    get jugadas (): Jugada[] {
      return this._jugadas
    }

    /**
     * @returns Contiene objetos del tipo {@link Jugada} que representan las jugadas sucedidas en el partido
     */
    get usuario (): Usuario {
      return this._usuario
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

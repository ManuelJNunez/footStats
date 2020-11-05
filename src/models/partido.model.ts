// partido.model.ts
/**
 * Este módulo contiene la declaración de la clase que representa a los partidos
 * @packageDocumentation
 */

import { Jugada } from './jugada.model'
import { PartidoI } from '../interfaces/partido.interface'
import { JugadaI } from '../interfaces/jugada.interface'

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

    /**
     * Crea un partido
     * @param horaIni Hora de inicio del partido nuevo
     * @param horaFin Hora de finalización del partido nuevo
     * @param usuario Usuario que ha registrado el partido nuevo
     */
    constructor (horaIni: Date, horaFin: Date) {
      if (horaIni > horaFin) {
        throw new Error('Hora de inicio mayor que hora de fin')
      }

      this._id = 0
      this._horaIni = horaIni
      this._horaFin = horaFin
      this._jugadas = []
    }

    /**
     * @return Identificador único del Partido
     */
    get id (): number {
      return this._id
    }

    /**
     * @return Hora de inicio del partido
     */
    get horaIni (): Date {
      return this._horaIni
    }

    /**
     * @param nuevaHora Nueva Hora de inicio del Partido
     */
    set horaIni (nuevaHora: Date) {
      this._horaIni = nuevaHora
    }

    /**
     * @return Hora de fin del partido
     */
    get horaFin (): Date {
      return this._horaFin
    }

    /**
     * @param nuevaHora Nueva Hora de fin del Partido
     */
    set horaFin (nuevaHora: Date) {
      this._horaFin = nuevaHora
    }

    /**
     * @return Contiene objetos del tipo {@link Jugada} que representan las jugadas sucedidas en el partido
     */
    get jugadas (): Jugada[] {
      return this._jugadas
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
     * @return Si la operación tuvo éxito o no
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

    toJSON (): PartidoI {
      const jugadas: JugadaI[] = []

      for (const jugada of this._jugadas) {
        jugadas.push(jugada)
      }

      const partido: PartidoI = {
        id: this._id,
        horaIni: this._horaIni,
        horaFin: this._horaFin,
        jugadas: jugadas
      }

      return partido
    }
}

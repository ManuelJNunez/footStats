// partido.model.ts
/**
 * Este módulo contiene la declaración de la clase que representa a los partidos
 * @packageDocumentation
 */

import { Jugada } from '../jugada/jugada.entity';
import { PartidoI } from './interfaces/partido.interface';
import { JugadaI } from '../jugada/interfaces/jugada.interface';
import { CreateMatchDTO } from './dto/create-match.dto';

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

  /** Lugar donde se jugará el partido */
  private _lugar: string;

  /** Histórico de jugadas que se han producido en el partido */
  private _jugadas: Jugada[];

  /**
   * Crea un partido
   * @param horaIni Hora de inicio del partido nuevo
   * @param horaFin Hora de finalización del partido nuevo
   * @param lugar Lugar donde se jugará el partido
   */
  constructor(id: number, horaIni: Date, horaFin: Date, lugar: string) {
    this._id = id;
    this._horaIni = horaIni;
    this._horaFin = horaFin;
    this._jugadas = [];
    this._lugar = lugar;
  }

  /**
   * @return Identificador único del Partido
   */
  get id(): number {
    return this._id;
  }

  /**
   * @return Hora de inicio del partido
   */
  get horaIni(): Date {
    return this._horaIni;
  }

  /**
   * @param nuevaHora Nueva Hora de inicio del Partido
   */
  set horaIni(nuevaHora: Date) {
    this._horaIni = nuevaHora;
  }

  /**
   * @return Hora de fin del partido
   */
  get horaFin(): Date {
    return this._horaFin;
  }

  /**
   * @param nuevaHora Nueva Hora de fin del Partido
   */
  set horaFin(nuevaHora: Date) {
    this._horaFin = nuevaHora;
  }

  /**
   * @return Lugar donde se jugará el partido
   */
  get lugar() {
    return this._lugar;
  }

  set lugar(nuevoLugar: string) {
    this._lugar = nuevoLugar;
  }

  /**
   * @return Contiene objetos del tipo {@link Jugada} que representan las jugadas sucedidas en el partido
   */
  get jugadas(): Jugada[] {
    return this._jugadas;
  }

  /**
   * Añade una jugada nueva al partido
   * @param jugada Objeto de la clase {@link Jugada} que contiene información sobre la misma
   */
  public addJugada(jugada: Jugada): void {
    if (
      !(
        jugada.momento.getTime() >= this.horaIni.getTime() &&
        jugada.momento.getTime() <= this.horaFin.getTime()
      )
    ) {
      throw new Error(
        'La jugada debe de suceder antes del fin del partido y después del inicio.',
      );
    }

    this.jugadas.push(jugada);
  }

  /**
   * Elimina una jugada del partido
   * @param jugada Objeto de la clase {@link Jugada} que queremos eliminar del partido
   * @return Si la operación tuvo éxito o no
   */
  public removeJugada(jugada: Jugada): boolean {
    const index = this.jugadas.indexOf(jugada);

    if (index > -1) {
      this.jugadas.splice(index);
      return true;
    } else {
      return false;
    }
  }

  static create(partidoDto: CreateMatchDTO, matchId: number) {
    return new Partido(
      matchId,
      new Date(Date.parse(partidoDto.horaIni)),
      new Date(Date.parse(partidoDto.horaFin)),
      partidoDto.lugar,
    );
  }

  toJSON(): PartidoI {
    const jugadas: JugadaI[] = [];

    for (const jugada of this._jugadas) {
      jugadas.push(jugada);
    }

    const partido: PartidoI = {
      id: this._id,
      horaIni: this._horaIni,
      horaFin: this._horaFin,
      lugar: this._lugar,
      jugadas: jugadas,
    };

    return partido;
  }

  static fromJSON(partido: PartidoI): Partido {
    return new Partido(
      partido.id,
      new Date(Date.parse(partido.horaIni.toISOString())),
      new Date(Date.parse(partido.horaFin.toISOString())),
      partido.lugar,
    );
  }
}

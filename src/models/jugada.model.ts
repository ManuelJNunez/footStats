// jugada.model.ts
/**
 * Este módulo contiene la declaración de la clase que representa las Jugadas
 * @packageDocumentation
 */

import { Partido } from './partido.model'

/**
 * Este enum contiene los posibles valores para los resultados de las jugadas
 */
export enum Resultado {
    /**
     * Este indica que la jugada ha salido bien
     */
    Acertado,
    /**
     * Este indica que la jugada ha salido mal
     */
    Fallido
}

/**
 * Este enum contiene los posibles valores para los tipos de jugadas
 */
export enum TipoJugada {
    Ataque,
    Defensa
}

/**
 * Clase que representa las jugadas
 */
export class Jugada {
    /**
     * Identificador único de la jugada
     */
    private _id: number;

    /**
     * Hora a la que sucede la jugada
     */
    private _momento: Date;

    /**
     * Tipo de jugada ver {@link TipoJugada}
     */
    private _tipo: TipoJugada;

    /**
     * Resultado de la jugada ver {@link Resultado}
     */
    private _resultado: Resultado;

    /**
     * Algún comentario adicional sobre la jugada sucedida
     */
    private _comentario: string;

    /**
     * {@link Partido} en el que sucedió la jugada
     */
    private _partido: Partido;

    /**
     * Crea una jugada
     * @param momento Hora a la que sucedió la jugada nueva
     * @param tipo Tipo de jugada nueva ver {@link TipoJugada}
     * @param resultado Resultado de la jugada nueva ver {@link Resultado}
     * @param partido {@link Partido} en el que sucedió la jugada nueva
     * @param comentario Comentario adicional sobre la jugada nueva
     */
    constructor (momento: Date, tipo: TipoJugada, resultado: Resultado, partido: Partido, comentario: string) {
      this._id = 0
      this._momento = momento
      this._tipo = tipo
      this._resultado = resultado
      this._partido = partido
      this._comentario = comentario
    }

    /**
     * @returns Identificador único de la Jugada
     */
    get id (): number {
      return this._id
    }

    /**
     * @returns Hora a la que se produce la Jugada
     */
    get momento (): Date {
      return this._momento
    }

    /**
     * @param momento Nuevo momento en el que sucede la jugada
     */
    set momento (momento: Date) {
      this._momento = momento
    }

    /**
     * @returns Tipo de jugada (ataque o defensa)
     */
    get tipo (): TipoJugada {
      return this._tipo
    }

    /**
     * @param tipo Nuevo tipo asignado a la Jugada
     */
    set tipo (tipo: TipoJugada) {
      this._tipo = tipo
    }

    /**
     * @returns Resultado de la jugada (acertada o fallida)
     */
    get resultado (): Resultado {
      return this._resultado
    }

    /**
     * @param resultado Nuevo resultado asignado a la Jugada
     */
    set resultado (resultado: Resultado) {
      this._resultado = resultado
    }

    /**
     * @returns Comentario sobre la Jugada
     */
    get comentario (): string {
      return this._comentario
    }

    /**
     * @param comentario Nuevo comentario asignado para la Jugada
     */
    set comentario (comentario: string) {
      this._comentario = comentario
    }

    /**
     * @returns Objeto del tipo {@link Partido} que representa el Partido en el que ha ocurrido la jugada
     */
    get partido (): Partido {
      return this._partido
    }
}

// jugada.model.ts
/**
 * Este módulo contiene la declaración de la clase que representa las Jugadas
 * @packageDocumentation
 */

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
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
@Entity()
export class Jugada extends BaseEntity {
    /**
     * Identificador único de la jugada
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Hora a la que sucede la jugada
     */
    @Column()
    momento: Date;

    /**
     * Tipo de jugada ver {@link TipoJugada}
     */
    @Column()
    tipo: TipoJugada;

    /**
     * Resultado de la jugada ver {@link Resultado}
     */
    @Column()
    resultado: Resultado;

    /**
     * Algún comentario adicional sobre la jugada sucedida
     */
    @Column()
    comentario: string;

    /**
     * {@link Partido} en el que sucedió la jugada
     */
    @OneToMany(() => Partido, partido => partido.jugadas)
    partido: Partido;

    /**
     * Crea una jugada
     * @param momento Hora a la que sucedió la jugada nueva
     * @param tipo Tipo de jugada nueva ver {@link TipoJugada}
     * @param resultado Resultado de la jugada nueva ver {@link Resultado}
     * @param partido {@link Partido} en el que sucedió la jugada nueva
     * @param comentario Comentario adicional sobre la jugada nueva
     */
    constructor (momento: Date, tipo: TipoJugada, resultado: Resultado, partido: Partido, comentario: string) {
      super()

      this.id = 0
      this.momento = momento
      this.tipo = tipo
      this.resultado = resultado
      this.partido = partido
      this.comentario = comentario
    }
}

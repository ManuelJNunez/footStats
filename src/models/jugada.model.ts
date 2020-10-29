import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm'
import { Partido } from './partido.model'

export enum Resultado {
    Acertado,
    Fallido
}

export enum TipoJugada {
    Ataque,
    Defensa
}

@Entity()
export class Jugada extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    momento: Date;

    @Column()
    tipo: TipoJugada;

    @Column()
    resultado: Resultado;

    @Column()
    comentario: string;

    @OneToMany(() => Partido, partido => partido.jugadas)
    partido: Partido;

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

import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from "typeorm";
import {Usuario} from "./usuario.model";

export enum Resultado {
    Acertado,
    Fallido
}

export enum Tipo {
    Ataque,
    Defensa
}

@Entity()
export class Partido{
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fechaIni!: Date;

    @Column()
    fechaFin!: Date;

    @Column()
    jugadas!: [{
        jugada: Tipo,
        resultado: Resultado,
        comentario: string
    }];

    @ManyToOne(() => Usuario, usuario => usuario.partidos)
    usuario!: Usuario;

}

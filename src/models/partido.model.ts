import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import {Usuario} from "./usuario.model";

export enum Resultado {
    Acertado,
    Fallido
}

export enum Tipo {
    Ataque,
    Defensa
}

export interface IJugada {
    momento: Date,
    jugada: Tipo,
    resultado: Resultado,
    comentario: string
}

@Entity()
export class Partido extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    horaIni: Date;

    @Column()
    horaFin: Date;

    @Column("simple-json")
    jugadas: IJugada[];

    @ManyToOne(() => Usuario, usuario => usuario.partidos)
    usuario: Usuario;

    constructor(horaIni: Date, horaFin: Date, usuario: Usuario) {
        super();

        if(horaIni > horaFin){
            throw new Error('Hora de inicio mayor que hora de fin');
        }

        this.id = 0;
        this.horaIni = horaIni;
        this.horaFin = horaFin;
        this.jugadas = [];
        this.usuario = usuario;
    }

    public addJugada(jugada: IJugada): void {
        if(!(jugada.momento.getTime() >= this.horaIni.getTime() && jugada.momento.getTime() <= this.horaFin.getTime())){
            throw new Error('La jugada debe de suceder antes del fin del partido y después del inicio.');
        }

        this.jugadas.push(jugada);
    }

    public removeJugada(jugada: IJugada): boolean {
        let index = this.jugadas.indexOf(jugada);

        if(index > -1) {
            this.jugadas.splice(index);
            return true;
        } else {
            return false;
        }
    }
}

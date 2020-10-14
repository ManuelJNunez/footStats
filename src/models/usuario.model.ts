import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import {Partido} from "./partido.model";

@Entity()
export class Usuario extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column({select: false})
    password: string;

    @OneToMany(() => Partido, partido => partido.usuario)
    partidos: Partido[];

    constructor(nombre: string, email: string, password: string){
        super();

        this.id = 0;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.partidos = [];
    }

    public addPartido(horaIni: Date, horaFin: Date): void {
        this.partidos.push(new Partido(horaIni, horaFin, this));
    }

    public removePartido(partido: Partido): boolean {
        const index = this.partidos.indexOf(partido);

        if(index > -1){
            this.partidos.splice(index);
            return true;
        }else{
            return false;
        }
    }

}
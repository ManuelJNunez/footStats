import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany} from "typeorm";
import {Partido} from "./partido.model";

@Entity()
export class Usuario{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Partido, partido => partido.usuario)
    partidos: Partido[];

}
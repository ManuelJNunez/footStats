import { PartidoI } from './partido.interface'

/**
 * Interfaz que representa al Usuario
 */
export interface UsuarioI {
    id: number;
    nombre: string;
    email: string;
    password?: string;
    partidos: PartidoI[];
}

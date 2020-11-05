import { PartidoI } from './partido.interface'

/**
 * Interfaz que representa al Usuario
 */
export interface UsuarioI {
    /** Identificador único del usuario */
    id: number;
    /** Nombre del usuario */
    nombre: string;
    /** Dirección de correo electrónico del usuario */
    email: string;
    /** Contraseña del usuario */
    password?: string;
    /** Objetos del tipo {@link Partido} registrados por el usuario */
    partidos: PartidoI[];
}

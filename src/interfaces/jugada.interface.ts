import { Resultado, TipoJugada } from '../models/jugada.model'

/**
 * Interfaz que representa a las Jugadas
 */
export interface JugadaI {
    /** Identificador único de la jugada */
    id: number;
    /** Tipo de jugada (Ataque o defensa) */
    tipo: TipoJugada;
    /** Resultado de la jugada (acertada o fallida) */
    resultado: Resultado;
    /** Comentario adicional sobre la jugada */
    comentario: string;
}

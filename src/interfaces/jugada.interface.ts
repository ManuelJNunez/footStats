import { Resultado, TipoJugada } from '../models/jugada.model'
import { PartidoI } from './partido.interface'

/**
 * Interfaz que representa a las Jugadas
 */
export interface JugadaI {
    id: number;
    tipo: TipoJugada;
    resultado: Resultado;
    comentario: string;
}

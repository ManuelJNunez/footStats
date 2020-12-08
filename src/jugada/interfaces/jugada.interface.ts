import { Resultado, TipoJugada } from '../jugada.entity';

/**
 * Interfaz que representa a las Jugadas
 */
export interface JugadaI {
  /** Identificador único de la Jugada */
  id: number;
  /** Momento en el que ocurre la Jugada */
  momento: Date;
  /** Tipo de jugada (Ataque o defensa) */
  tipo: TipoJugada;
  /** Resultado de la jugada (acertada o fallida) */
  resultado: Resultado;
  /** Comentario adicional sobre la jugada */
  comentario: string;
}

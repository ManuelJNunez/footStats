import { JugadaI } from './jugada.interface';

/**
 * Interfaz que representa los partidos
 */
export interface PartidoI {
  /** Identificador único del Partido */
  id: number;
  /** Hora de inicio del Partido */
  horaIni: Date;
  /** Hora de finalización del partido */
  horaFin: Date;
  /** Objetivos del tipo {@link JugadaI} que han sucede en el Partido */
  jugadas: JugadaI[];
}

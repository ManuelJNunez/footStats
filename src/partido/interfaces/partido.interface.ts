import { JugadaI } from '../../jugada/interfaces/jugada.interface';

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
  /** Lugar en el que se juega el partido */
  lugar: string;
  /** Objetivos del tipo {@link JugadaI} que han sucede en el Partido */
  jugadas?: JugadaI[];
}

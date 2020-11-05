import { UsuarioI } from './usuario.interface'
import { JugadaI } from './jugada.interface'

export interface PartidoI {
    id: number;
    horaIni: Date;
    horaFin: Date;
    jugadas: JugadaI[];
}

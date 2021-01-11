import { IsNotEmpty } from 'class-validator';

export class CreateMatchDTO {
  @IsNotEmpty()
  readonly horaIni: string;

  @IsNotEmpty()
  readonly horaFin: string;

  @IsNotEmpty()
  readonly lugar: string;
}

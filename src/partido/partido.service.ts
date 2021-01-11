import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import { CreateMatchDTO } from './dto/create-match.dto';
import { Partido } from './partido.entity';

@Injectable()
export class PartidoService {
  private readonly pool;

  constructor(private readonly pgService: PgService) {
    this.pool = this.pgService.getPool();
  }

  private checkDates(horaIni: string, horaFin: string) {
    const isodate = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;

    if (!isodate.test(horaIni) || !isodate.test(horaFin)) {
      throw new HttpException(
        'Formato de fechas inválida. Pruebe con YYYY-MM-DD hh:mm:ss',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dateIni = Date.parse(horaIni);
    const dateFin = Date.parse(horaFin);

    if (dateIni > dateFin) {
      throw new HttpException(
        'La hora de inicio no puede ser después de la hora de finalización.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(partidoDto: CreateMatchDTO, userId: number) {
    this.checkDates(partidoDto.horaIni, partidoDto.horaFin);

    const matchId = await this.pool.query(
      `INSERT INTO matches ("horaIni", "horaFin", "lugar", "userId") 
      VALUES ('${partidoDto.horaIni}', '${partidoDto.horaFin}', '${partidoDto.lugar}', '${userId}')
      RETURNING "matchId"`,
    );

    const partido = Partido.create(partidoDto, matchId.rows[0].matchId);

    return partido;
  }

  async findById(userId: number, matchId: number) {
    const queryResult = await this.pool.query(
      `SELECT * FROM matches WHERE "matchId" = '${matchId}'`,
    );

    if (queryResult.rowCount === 0) {
      throw new HttpException('Partido no encontrado', HttpStatus.NOT_FOUND);
    }

    const match = queryResult.rows[0];

    if (userId != match.userId) {
      throw new HttpException(
        'Este partido no ha sido registrado por ti',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const matchObj = Partido.fromJSON(match);

    return matchObj;
  }

  async findMatchesOfUser(userId: number) {
    const queryResult = await this.pool.query(
      `SELECT * FROM matches WHERE "userId" = ${userId}`,
    );

    if (queryResult.rowCount === 0) {
      throw new HttpException('Partido no encontrado', HttpStatus.NOT_FOUND);
    }

    const matches = queryResult.rows;
    const matchesObj = [];

    for (const match of matches) {
      matchesObj.push(Partido.fromJSON(match));
    }

    return matchesObj;
  }

  async update(matchDto: CreateMatchDTO, matchId: number, userId: number) {
    this.checkDates(matchDto.horaIni, matchDto.horaFin);

    const queryResult = await this.pool.query(
      `UPDATE matches
       SET "horaIni" = '${matchDto.horaIni}', "horaFin" = '${matchDto.horaFin}', lugar = '${matchDto.lugar}'
       WHERE "matchId" = ${matchId}
       RETURNING "matchId", "horaIni", "horaFin", lugar, "userId"`,
    );

    if (queryResult.rowCount === 0) {
      throw new HttpException('Partido no encontrado', HttpStatus.NOT_FOUND);
    }

    if (userId != queryResult.rows[0].userId) {
      throw new HttpException(
        'Este partido no ha sido registrado por ti',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const match = Partido.fromJSON(queryResult.rows[0]);

    return match;
  }

  async delete(matchId: number, userId: number) {
    let queryResult = await this.pool.query(
      `SELECT * FROM matches WHERE "matchId" = ${matchId}`,
    );

    if (queryResult.rowCount === 0) {
      throw new HttpException('Partido no encontrado', HttpStatus.NOT_FOUND);
    }

    if (queryResult.rows[0].userId != userId) {
      throw new HttpException(
        'Este partido no ha sido registrado por ti',
        HttpStatus.UNAUTHORIZED,
      );
    }

    queryResult = await this.pool.query(
      `DELETE FROM matches WHERE "matchId" = ${matchId} RETURNING "matchId", "horaIni", "horaFin", "lugar"`,
    );

    const match = Partido.fromJSON(queryResult.rows[0]);

    return match;
  }
}

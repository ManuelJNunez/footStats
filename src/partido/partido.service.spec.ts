import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
import { PartidoService } from './partido.service';
import { Pool } from 'pg';
import { Partido } from './partido.entity';
import { HttpException } from '@nestjs/common';
import { PgModule } from '../pg/pg.module';

describe('PartidoService', () => {
  let service: PartidoService;
  let mockCreate;
  let mockQuery;
  let mockFromJSON;
  const matchId = 1;
  const userId = 0;
  const anotherUserId = 2;
  const horaIni = '2021-01-10 16:00:00';
  const invalidHoraIni = '2021-01-10 16:00';
  const horaFin = '2021-01-10 16:45:00';
  const lugar = 'El Zaidín';

  const updateHoraIni = '2021-01-10 20:00:00';
  const updateHoraFin = '2021-01-10 20:45:00';
  const updateLugar = 'La Chana';

  const matchDto = {
    horaIni,
    horaFin,
    lugar,
  };

  const updateMatchDto = {
    horaIni: updateHoraIni,
    horaFin: updateHoraFin,
    lugar: updateLugar,
  };

  const invalidStringMatchDto = {
    horaIni: invalidHoraIni,
    horaFin,
    lugar,
  };

  const invalidDatesDto = {
    horaIni: horaFin,
    horaFin: horaIni,
    lugar,
  };

  const matchObj = ({
    id: matchId,
    horaIni,
    horaFin,
    lugar,
    jugadas: [],
  } as unknown) as Partido;

  const updateMatchObj = ({
    id: matchId,
    horaIni: updateHoraIni,
    horaFin: updateHoraFin,
    lugar: updateLugar,
    jugadas: [],
  } as unknown) as Partido;

  const queryResult = {
    matchId,
    horaIni,
    horaFin,
    lugar,
    userId,
  };

  const updatedQueryResult = {
    matchId,
    horaIni: updateHoraIni,
    horaFin: updateHoraFin,
    lugar: updateLugar,
    userId,
  };

  const deleteQueryResult = {
    matchId,
    horaIni,
    horaFin,
    lugar,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PgModule],
      providers: [PartidoService, EtcdService, AuthGuard],
    }).compile();

    service = module.get<PartidoService>(PartidoService);

    mockQuery = Pool.prototype.query = jest.fn();
    mockCreate = jest.spyOn(Partido, 'create');
    mockFromJSON = jest.spyOn(Partido, 'fromJSON');
  });

  afterEach(() => {
    mockQuery.mockClear();
    mockCreate.mockClear();
    mockFromJSON.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a match', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ matchId }], rowCount: 1 });
    mockCreate.mockReturnValueOnce(matchObj);

    const newMatch = await service.create(matchDto); //, userId);

    expect(newMatch.id).toEqual(matchId);
    expect(newMatch.horaIni).toEqual(matchDto.horaIni);
    expect(newMatch.horaFin).toEqual(matchDto.horaFin);
    expect(newMatch.lugar).toEqual(matchDto.lugar);
    expect(newMatch.jugadas).toHaveLength(0);
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO matches ("horaIni", "horaFin", "lugar") 
      VALUES ('${matchDto.horaIni}', '${matchDto.horaFin}', '${matchDto.lugar}')
      RETURNING "matchId"`,
    );
    expect(mockCreate).toHaveBeenCalledWith(matchDto, matchId);
  });

  it('should faild because the date string format is not valid', () => {
    async function invalidDateFormat() {
      await service.create(invalidStringMatchDto); //, userId);
    }

    expect(invalidDateFormat).rejects.toThrow(HttpException);
  });

  it('should faild because the date string format is not valid', () => {
    async function invalidDates() {
      await service.create(invalidDatesDto); //, userId);
    }

    expect(invalidDates).rejects.toThrow(HttpException);
  });

  it('should find the match', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 });
    mockFromJSON.mockReturnValueOnce(matchObj);

    const matchFound = await service.findById(/*userId,*/ matchId);

    expect(matchFound).toEqual(matchObj);
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT * FROM matches WHERE "matchId" = '${matchId}'`,
    );
    expect(mockFromJSON).toHaveBeenCalledWith(queryResult);
  });

  it('should throw an exception because the match does not exist', () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    async function userNotExists() {
      await service.findById(userId); //, matchId);
    }

    expect(userNotExists).rejects.toThrow(HttpException);
  });

  /*it('should throw an exception because the userId is different.', () => {
    mockQuery.mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 });

    async function userNotExists() {
      await service.findById(anotherUserId, matchId);
    }

    expect(userNotExists).rejects.toThrow(HttpException);
  });*/

  it('should retrieve all the matches of a user', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 });
    mockFromJSON.mockReturnValueOnce(matchObj);

    const matchesFound = await service.findMatchesOfUser(userId);

    expect(matchesFound).toEqual([matchObj]);
    expect(mockFromJSON).toHaveBeenCalledTimes(1);
    expect(mockFromJSON).toHaveBeenCalledWith(queryResult);
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT * FROM matches WHERE "userId" = ${userId}`,
    );
  });

  it('should throw an exception because the user has not matches', () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    async function noMatches() {
      await service.findMatchesOfUser(userId);
    }

    expect(noMatches).rejects.toThrow(HttpException);
  });

  it('should update an existing match', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [updatedQueryResult], rowCount: 1 });
    mockFromJSON.mockResolvedValueOnce(updateMatchObj);

    await service.update(updateMatchDto, matchId, userId);

    expect(mockFromJSON).toHaveBeenCalledWith(updatedQueryResult);
    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      `SELECT * FROM matches WHERE "matchId" = '${matchId}'`,
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      `UPDATE matches
       SET "horaIni" = '${updateMatchDto.horaIni}', "horaFin" = '${updateMatchDto.horaFin}', lugar = '${updateMatchDto.lugar}'
       WHERE "matchId" = ${matchId}
       RETURNING "matchId", "horaIni", "horaFin", lugar, "userId"`,
    );
  });

  it('should throw an exception because the match does not exist', () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    async function matchDontFound() {
      await service.update(updateMatchDto, matchId, userId);
    }

    expect(matchDontFound).rejects.toThrow(HttpException);
  });

  it('should throw an exception because userId is diferent', () => {
    mockQuery.mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 });

    async function invalidUser() {
      await service.update(updateMatchDto, matchId, anotherUserId);
    }

    expect(invalidUser).rejects.toThrow(HttpException);
  });

  it('should delete the match', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [deleteQueryResult], rowCount: 1 });
    mockFromJSON.mockResolvedValueOnce(matchObj);

    const deletedMatch = await service.delete(matchId, userId);

    expect(deletedMatch).toEqual(matchObj);
    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      `SELECT * FROM matches WHERE "matchId" = ${matchId}`,
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      `DELETE FROM matches WHERE "matchId" = ${matchId} RETURNING "matchId", "horaIni", "horaFin", "lugar"`,
    );
  });

  it('should throw an exception because the match doest not exist', () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    async function matchNotFound() {
      await service.delete(matchId, userId);
    }

    expect(matchNotFound).rejects.toThrow(HttpException);
  });

  it('should throw an exception because the match doest not exist', () => {
    mockQuery.mockResolvedValueOnce({ rows: [queryResult], rowCount: 1 });

    async function userUnauthorized() {
      await service.delete(matchId, anotherUserId);
    }

    expect(userUnauthorized).rejects.toThrow(HttpException);
  });
});

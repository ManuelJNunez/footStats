import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PgModule } from '../pg/pg.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
import { PartidoController } from './partido.controller';
import { Partido } from './partido.entity';
import { PartidoService } from './partido.service';
import { Response } from 'express';
const jwt = require('jsonwebtoken');

describe('PartidoController', () => {
  let controller: PartidoController;
  let service: PartidoService;
  let spyDecode;
  const matchId = 1;
  const anotherid = 2;
  const horaIni = '2021-01-10 16:00:00';
  const horaFin = '2021-01-10 16:45:00';
  const lugar = 'El Zaidín';
  const token = 'aValidToken';

  const mockResponse = ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    json: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    set: () => {},
  } as unknown) as Response;

  const matchDto = {
    horaIni,
    horaFin,
    lugar,
  };

  const matchObj = ({
    id: matchId,
    horaIni,
    horaFin,
    lugar,
    jugadas: [],
  } as unknown) as Partido;

  const user = {
    id: 0,
    nickname: 'mjnunez',
    email: 'manueljesusnunezruiz@gmail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PgModule],
      controllers: [PartidoController],
      providers: [PartidoService, EtcdService, AuthGuard],
    }).compile();

    controller = module.get<PartidoController>(PartidoController);
    service = module.get<PartidoService>(PartidoService);

    spyDecode = jest.spyOn(jwt, 'decode');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    spyDecode.mockClear();
  });

  it('should retrieve the match registered', async () => {
    const spyCreate = jest.spyOn(service, 'create');

    spyDecode.mockReturnValueOnce(user);
    spyCreate.mockResolvedValueOnce(matchObj);

    const spySet = jest.spyOn(mockResponse, 'set');
    const spyJson = jest.spyOn(mockResponse, 'json');

    await controller.create(`Bearer ${token}`, matchDto, mockResponse);

    expect(spyDecode).toHaveBeenCalledWith(token, { json: true });
    expect(spyCreate).toHaveBeenCalledWith(matchDto, user.id);
    expect(spySet).toHaveBeenCalledWith('Location', `/matches/${matchObj.id}`);
    expect(spyJson).toHaveBeenCalledWith(matchObj);
  });

  it('should retrieve the match which matchId is 0', async () => {
    const spyFindById = jest.spyOn(service, 'findById');

    spyDecode.mockReturnValueOnce(user);
    spyFindById.mockResolvedValueOnce(matchObj);

    const response = await controller.getMatch(`Bearer ${token}`, matchId);

    expect(response).toEqual(matchObj);
    expect(spyDecode).toHaveBeenCalledWith(token, { json: true });
    expect(spyFindById).toHaveBeenCalledWith(user.id, matchId);
  });

  it('should retrieve all the matches of the user', async () => {
    const spyMatchesOfUser = jest.spyOn(service, 'findMatchesOfUser');

    spyDecode.mockReturnValueOnce(user);
    spyMatchesOfUser.mockResolvedValueOnce([matchObj]);

    const response = await controller.getMatches(`Bearer ${token}`, user.id);

    expect(response).toEqual([matchObj]);
    expect(spyDecode).toHaveBeenCalledWith(token, { json: true });
    expect(spyMatchesOfUser).toHaveBeenCalledWith(user.id);
  });

  it('should throw an exception because the id is different', () => {
    spyDecode.mockReturnValueOnce(user);

    async function unathorizedException() {
      await controller.getMatches(`Bearer ${token}`, anotherid);
    }

    expect(unathorizedException).rejects.toThrow(UnauthorizedException);
  });

  it('should retrieve the updated user', async () => {
    const spyUpdate = jest.spyOn(service, 'update');

    spyDecode.mockReturnValueOnce(user);
    spyUpdate.mockResolvedValueOnce(matchObj);

    const spySet = jest.spyOn(mockResponse, 'set');
    const spyJson = jest.spyOn(mockResponse, 'json');

    await controller.updateMatch(
      //`Bearer ${token}`,
      matchDto,
      matchId,
      mockResponse,
    );

    expect(spyDecode).toHaveBeenCalledWith(token, { json: true });
    expect(spyUpdate).toHaveBeenCalledWith(matchDto, matchId); // user.id);
    expect(spySet).toHaveBeenCalledWith('Location', `/matches/${matchId}`);
    expect(spyJson).toHaveBeenCalledWith(matchObj);
  });

  it('should retrieve the deleted user', async () => {
    const spyDelete = jest.spyOn(service, 'delete');

    spyDecode.mockReturnValueOnce(user);
    spyDelete.mockResolvedValueOnce(matchObj);

    const response = await controller.deleteMatch(`Bearer ${token}`, matchId);

    expect(response.match).toEqual(matchObj);
    expect(spyDecode).toHaveBeenCalledWith(token, { json: true });
    expect(spyDelete).toHaveBeenCalledWith(matchId, user.id);
  });
});

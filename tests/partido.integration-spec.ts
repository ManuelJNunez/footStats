import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PartidoModule } from '../src/partido/partido.module';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { PartidoService } from '../src/partido/partido.service';
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Partido endpoints', () => {
  let app: INestApplication;
  let token;
  const matchId = 5;
  const userId = 1;
  let spyDecode;
  const email = 'validemail@gmail.com';
  const nickname = 'manolo';
  const password = 'holaqtal';

  const user = {
    email,
    password,
    nickname,
  };

  const login = {
    email,
    password,
  };

  const match = {
    horaIni: '2021-02-22 18:00:00',
    horaFin: '2021-02-22 18:45:00',
    lugar: 'Granada',
  };

  const updateMatch = {
    horaIni: '2021-02-22 20:00:00',
    horaFin: '2021-02-22 20:45:00',
    lugar: 'El Zaidín',
  };

  const partidoService = {
    create: (newMatch, userid) => {
      return {
        matchId,
        horaIni: newMatch.horaIni,
        horaFin: newMatch.horaFin,
        lugar: match.lugar,
      };
    },
    findById: (userid, id) => {
      return {
        horaIni: match.horaIni,
        horaFin: match.horaFin,
        lugar: match.lugar,
        jugadas: [],
      };
    },
    update: (matchDto, id, userid) => {
      return {
        horaIni: matchDto.horaIni,
        horaFin: matchDto.horaFin,
        lugar: matchDto.lugar,
        jugadas: [],
      };
    },
    delete: (id, userid) => {
      return {
        horaIni: updateMatch.horaIni,
        horaFin: updateMatch.horaFin,
        lugar: updateMatch.lugar,
        jugadas: [],
      };
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PartidoModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(PartidoService)
      .useValue(partidoService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    spyDecode = jest.spyOn(jwt, 'decode');
    spyDecode.mockImplementation(() => {
      return { id: userId };
    });
  });

  it('POST /matches', () => {
    return request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send(match)
      .expect(201)
      .expect((res) => {
        expect(res.body.matchId).toEqual(matchId);
        expect(res.body.horaIni).toEqual(match.horaIni);
        expect(res.body.horaFin).toEqual(match.horaFin);
        expect(res.body.lugar).toEqual(match.lugar);
      });
  });

  it('GET /matches', () => {
    return request(app.getHttpServer())
      .get(`/matches/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        horaIni: match.horaIni,
        horaFin: match.horaFin,
        lugar: match.lugar,
        jugadas: [],
      });
  });

  it('PUT /matches', () => {
    return request(app.getHttpServer())
      .put(`/matches/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateMatch)
      .expect(200)
      .expect({
        message: 'Partido actualizado con éxito',
        match: {
          horaIni: updateMatch.horaIni,
          horaFin: updateMatch.horaFin,
          lugar: updateMatch.lugar,
          jugadas: [],
        },
      });
  });

  it('DELETE /matches', () => {
    return request(app.getHttpServer())
      .delete(`/matches/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateMatch)
      .expect(200)
      .expect({
        message: 'Partido eliminado con éxito',
        match: {
          horaIni: updateMatch.horaIni,
          horaFin: updateMatch.horaFin,
          lugar: updateMatch.lugar,
          jugadas: [],
        },
      });
  });

  afterAll(() => {
    app.close();
  });
});

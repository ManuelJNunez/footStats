import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UsuarioModule } from "../src/usuario/usuario.module";
import { PartidoModule } from "../src/partido/partido.module";
const request = require('supertest');

describe('Partido endpoints', () => {
  let app: INestApplication;
  let token;
  let matchId;
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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PartidoModule, UsuarioModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(user)
      .expect(201);
  });

  it('POST /user/login', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(login)
      .expect(200)
      .expect((res) => {
        token = res.body.token;
      });
  });

  it('POST /matches', () => {
    return request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send(match)
      .expect(201)
      .expect((res) => {
        matchId = res.body.id;
        expect(res.body.horaIni).toEqual('2021-02-22T18:00:00.000Z');
        expect(res.body.horaFin).toEqual('2021-02-22T18:45:00.000Z');
        expect(res.body.lugar).toEqual(match.lugar);
      });
  });

  it('GET /matches', () => {
    return request(app.getHttpServer())
      .get(`/matches/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        horaIni: '2021-02-22T18:00:00.000Z',
        horaFin: '2021-02-22T18:45:00.000Z',
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
          horaIni: '2021-02-22T20:00:00.000Z',
          horaFin: '2021-02-22T20:45:00.000Z',
          lugar: updateMatch.lugar,
          jugadas: [],
        }
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
          horaIni: '2021-02-22T20:00:00.000Z',
          horaFin: '2021-02-22T20:45:00.000Z',
          lugar: updateMatch.lugar,
          jugadas: [],
        }
      });
  });

  afterAll(() => {
    app.close();
  });
});

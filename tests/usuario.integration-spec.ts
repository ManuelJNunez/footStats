import { Test } from '@nestjs/testing';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');

describe('Usuario endpoints', () => {
  let app: INestApplication;
  const email = 'manueljesusnunezruiz@gmail.com';
  const nickname = 'mjnunez';
  const password = '1234';
  let token;
  let id;

  const user = {
    email,
    password,
    nickname,
  };

  const updateUser = {
    email: 'mjnunez@correo.ugr.es',
    password: 'hola',
    nickname: 'manuel',
  };

  const login = {
    email,
    password,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsuarioModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(user)
      .expect(201)
      .expect((res) => {
        id = res.body.user.id;
        expect(res.body.user.email).toEqual(user.email);
        expect(res.body.user.nickname).toEqual(user.nickname);
      });
  });

  it('POST /user/login', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(login)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
      });
  });

  it('GET /user', () => {
    return request(app.getHttpServer())
      .get(`/user/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, {
        id: id,
        email: user.email,
        nickname: user.nickname,
      });
  });

  it('GET /user 401', () => {
    return request(app.getHttpServer())
      .get('/user/100')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('GET /user 403', () => {
    return request(app.getHttpServer()).get(`/user/${id}`).expect(403);
  });

  it('PUT /user', () => {
    return request(app.getHttpServer())
      .put(`/user/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateUser)
      .expect(200, {
        message: 'Usuario modificado con éxito',
        user: {
          id,
          nickname: 'manuel',
          email: 'mjnunez@correo.ugr.es',
        },
      });
  });

  it('DELETE /user', () => {
    return request(app.getHttpServer())
      .delete(`/user/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200, {
        message: 'Usuario eliminado con éxito',
        user: {
          id,
          nickname: 'manuel',
          email: 'mjnunez@correo.ugr.es',
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

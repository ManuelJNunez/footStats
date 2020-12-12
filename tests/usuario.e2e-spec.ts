import { Test } from '@nestjs/testing';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { UsuarioService } from '../src/usuario/usuario.service';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/common/guards/auth.guard';
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Usuarios', () => {
  let app: INestApplication;

  const usuarioService = {
    create: (user) => {
      return 'test';
    },
    findByEmail: (email) => {
      return 'found';
    },
    update: (id, user) => {
      return `updating ${id}`;
    },
    delete: (id, user) => {
      return `deleting ${id}`;
    },
    generarToken: (login) => {
      return `aValidToken`;
    },
  };

  const token = 'aValidToken';

  const user = {
    id: 0,
    email: 'manueljesusnunezruiz@gmail.com',
    password: '1234',
    nickname: 'mjnunez',
  };

  const spyJwt = jest.spyOn(jwt, 'decode');
  spyJwt.mockReturnValue(user);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsuarioModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .overrideProvider(UsuarioService)
      .useValue(usuarioService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(user)
      .expect(201)
      .expect({
        message: 'Usuario registrado con éxito',
        user: usuarioService.create(user),
      });
  });

  it('GET /user', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(user.email)
      .expect(200, usuarioService.findByEmail(user.email));
  });

  it('PUT /user', () => {
    return request(app.getHttpServer())
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200, {
        message: 'Usuario modificado con éxito',
        user: usuarioService.update(user.id, user),
      });
  });

  it('DELETE /user', () => {
    return request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200, {
        message: 'Usuario eliminado con éxito',
        user: usuarioService.delete(user.id, user),
      });
  });

  it('POST /user/login', () => {
    const login = {
      email: user.email,
      password: user.password,
    };

    return request(app.getHttpServer())
      .post(`/user/login`)
      .send(login)
      .expect(200, {
        message: 'Logeado con éxito',
        token: usuarioService.generarToken(login),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

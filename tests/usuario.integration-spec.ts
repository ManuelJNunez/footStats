import { Test } from '@nestjs/testing';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { UsuarioService } from '../src/usuario/usuario.service';
import { Usuario } from '../src/usuario/usuario.entity';
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Usuario endpoints', () => {
  let app: INestApplication;
  const email = 'manueljesusnunezruiz@gmail.com';
  const nickname = 'mjnunez';
  const password = '1234';
  const token = 'aValidToken';
  const id = 1;
  let spyDecode;

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

  const usuarioService = {
    create: (user) => {
      return {
        id,
        email: user.email,
        nickname: user.nickname,
      } as Usuario;
    },
    findByEmail: (email) => {
      return {
        id,
        email: user.email,
        nickname: user.nickname,
      };
    },
    update: (id, user) => {
      return {
        id,
        email: user.email,
        nickname: user.nickname,
      };
    },
    delete: (id) => {
      return {
        id,
        email: updateUser.email,
        nickname: updateUser.nickname,
      };
    },
    generarToken: (login) => {
      return `aValidToken`;
    },
  };

  const authGuard = {
    canActivate: (context: ExecutionContext): boolean => {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization;

      if (token == null) {
        return false;
      }

      const res = token.split(' ');

      if (res.length < 2 || res[0] != 'Bearer') {
        return false;
      }

      if (res[1] === 'aValidToken') {
        return true;
      } else {
        return false;
      }
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsuarioModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuard)
      .overrideProvider(UsuarioService)
      .useValue(usuarioService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    spyDecode = jest.spyOn(jwt, 'decode');
    spyDecode.mockImplementation(() => {
      return { id };
    });
  });

  it('POST /user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual(id);
        expect(res.body.email).toEqual(user.email);
        expect(res.body.nickname).toEqual(user.nickname);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('POST /user/login', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(login)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
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
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(`${id}`);
        expect(res.body.email).toEqual(updateUser.email);
        expect(res.body.nickname).toEqual(updateUser.nickname);
        expect(res.body).not.toHaveProperty('password');
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
          id: `${id}`,
          nickname: updateUser.nickname,
          email: updateUser.email,
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

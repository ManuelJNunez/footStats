import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { Pool } from 'pg';
import { UsuarioI } from '../../usuario/interfaces/usuario.interface';
import { AuthGuard } from './auth.guard';
const jwt = require('jsonwebtoken');

const password = 'aSecretPassword';

const etcdService = {
  get: jest.fn(),
  getClient: jest.fn(),
} as any;

const pgService = {
  getPool: jest.fn(() => {
    return new Pool();
  }),
} as any;

const user = {
  userId: 0,
  nickname: 'mjnunez',
  email: 'manueljesusnunezruiz@gmail.com',
} as UsuarioI;

describe('AuthGuard', () => {
  let mockQuery;
  let context;

  beforeEach(() => {
    context = createMock<ExecutionContext>();
    mockQuery = Pool.prototype.query = jest.fn();
    etcdService.get.mockReturnValueOnce(password);
    etcdService.get.mockClear();
  });

  afterEach(() => {
    mockQuery.mockClear();
  });

  it('should be defined', () => {
    expect(new AuthGuard(etcdService, pgService)).toBeDefined();
  });

  it('should accept the context', async () => {
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';

    spy.mockReturnValueOnce({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const spyJwt = jest.spyOn(jwt, 'verify');
    spyJwt.mockReturnValueOnce(user);
    mockQuery.mockResolvedValueOnce({ rows: [user], rowCount: 1 });

    const result = await new AuthGuard(etcdService, pgService).canActivate(
      context,
    );

    expect(result).toBe(true);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, password);
    expect(etcdService.get).toBeCalledTimes(1);
    expect(mockQuery).toBeCalledWith(
      `SELECT * FROM users WHERE "userId" = '${user.userId}'`,
    );
  });

  it('should reject because authorization is not defined', async () => {
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');

    spy.mockReturnValueOnce({
      headers: {},
    });

    const result = await new AuthGuard(etcdService, pgService).canActivate(
      context,
    );

    expect(result).toBeFalsy();
  });

  it('should reject because there is no token', async () => {
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');

    spy.mockReturnValueOnce({
      headers: {
        authorization: `Bearer`,
      },
    });

    const result = await new AuthGuard(etcdService, pgService).canActivate(
      context,
    );

    expect(result).toBeFalsy();
  });

  it('should reject because the authorization field is invalid', async () => {
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';

    spy.mockReturnValueOnce({
      headers: {
        authorization: token,
      },
    });

    const result = await new AuthGuard(etcdService, pgService).canActivate(
      context,
    );

    expect(result).toBeFalsy();
  });

  it('should reject because verify throws an exception', async () => {
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';

    spy.mockReturnValueOnce({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const spyJwt = jest.spyOn(jwt, 'verify');
    spyJwt.mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await new AuthGuard(etcdService, pgService).canActivate(
      context,
    );

    expect(result).toBeFalsy();
  });

  it("should reject because the user doesn't exist", async () => {
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';

    spy.mockReturnValueOnce({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const spyJwt = jest.spyOn(jwt, 'verify');
    spyJwt.mockReturnValueOnce(user);
    mockQuery.mockReturnValueOnce({ rows: [], rowCount: 0 });

    const result = await new AuthGuard(etcdService, pgService).canActivate(
      context,
    );

    expect(result).toBeFalsy();
  });
});

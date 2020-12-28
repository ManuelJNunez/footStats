import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
const jwt = require('jsonwebtoken');

const password = 'aSecretPassword';

const etcdService = {
  get: jest.fn(),
  getClient: jest.fn(),
} as any;

describe('AuthGuard', () => {
  beforeEach(() => {
    etcdService.get.mockReturnValueOnce(password);
    etcdService.get.mockClear();
  });

  it('should be defined', () => {
    expect(new AuthGuard(etcdService)).toBeDefined();
  });

  it('should accept the context', async () => {
    const context = createMock<ExecutionContext>();
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';

    spy.mockReturnValueOnce({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const spyJwt = jest.spyOn(jwt, 'verify');
    spyJwt.mockReturnValueOnce('verified :D');

    const result = await new AuthGuard(etcdService).canActivate(context);

    expect(result).toBe(true);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, password);
    expect(etcdService.get).toBeCalledTimes(1);
  });

  it('should reject because there is no Bearer in the token', async () => {
    const context = createMock<ExecutionContext>();
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';
    process.env.JWT_SECRET = 'aSecretPasssowrd';

    spy.mockReturnValueOnce({
      headers: {
        authorization: token,
      },
    });

    const result = await new AuthGuard(etcdService).canActivate(context);

    expect(result).toBe(false);
    expect(etcdService.get).toBeCalledTimes(1);
  });

  it('should reject because there is no token', async () => {
    const context = createMock<ExecutionContext>();

    const result = await new AuthGuard(etcdService).canActivate(context);

    expect(result).toBe(false);
    expect(etcdService.get).toBeCalledTimes(0);
  });
});

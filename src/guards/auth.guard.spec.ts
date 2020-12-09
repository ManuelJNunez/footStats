import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
const jwt = require('jsonwebtoken');

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });

  it('should accept the context', () => {
    const context = createMock<ExecutionContext>();
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';
    process.env.JWT_SECRET = 'aSecretPasssowrd';

    spy.mockReturnValueOnce({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const spyJwt = jest.spyOn(jwt, 'verify');

    spyJwt.mockReturnValueOnce('verified :D');

    const result = new AuthGuard().canActivate(context);

    expect(result).toBe(true);
    expect(spyJwt).toBeCalledTimes(1);
    expect(spyJwt).toBeCalledWith(token, process.env.JWT_SECRET);
  });

  it('should reject because there is no Bearer in the token', () => {
    const context = createMock<ExecutionContext>();
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    const token = 'aVeryValidToken';
    process.env.JWT_SECRET = 'aSecretPasssowrd';

    spy.mockReturnValueOnce({
      headers: {
        authorization: token,
      },
    });

    const result = new AuthGuard().canActivate(context);

    expect(result).toBe(false);
  });

  it('should reject because there is no token', () => {
    const context = createMock<ExecutionContext>();

    const result = new AuthGuard().canActivate(context);

    expect(result).toBe(false);
  });
});

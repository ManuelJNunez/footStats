import { Logger } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined();
  });

  it('Should call next and the logger', () => {
    const req = {
      method: 'method',
      url: '/somepath',
    };

    const res = {
      statusCode: 200,
    };

    const next = jest.fn();
    const logMock = (Logger.prototype.log = jest.fn());

    new LoggerMiddleware().use(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(logMock).toBeCalledTimes(1);
    expect(logMock).toBeCalledWith(
      `Method: '${req.method}' PATH: '${req.url}' STATUS: '${res.statusCode}'`,
    );
  });
});

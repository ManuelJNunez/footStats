import { Test, TestingModule } from '@nestjs/testing';
import { Etcd3 } from 'etcd3';
import { EtcdService } from './etcd.service';

describe('EtcdService', () => {
  let service: EtcdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtcdService],
    }).compile();

    service = module.get<EtcdService>(EtcdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve the client', () => {
    const result = service.getClient();

    expect(result).toBeInstanceOf(Etcd3);
  });

  it('should works with etcd', async () => {
    const spy = (Etcd3.prototype.get = jest.fn());
    const key = 'hello';

    spy.mockReturnValueOnce('hi');

    const result = await service.get(key);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(key);
    expect(result).toBe('hi');
  });

  it('should works with process environment', async () => {
    const spy = (Etcd3.prototype.get = jest.fn());
    const key = 'hello';
    const expected = 'hi';
    process.env.hello = expected;

    spy.mockImplementationOnce((key) => {
      throw new Error();
    });

    const result = await service.get(key);
    expect(spy).toBeCalledWith(key);
    expect(result).toBe(expected);
  });
});

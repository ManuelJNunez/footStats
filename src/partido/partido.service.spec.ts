import { Test, TestingModule } from '@nestjs/testing';
import { PgService } from '../pg/pg.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
import { PartidoService } from './partido.service';

describe('PartidoService', () => {
  let service: PartidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartidoService, EtcdService, AuthGuard, PgService],
    }).compile();

    service = module.get<PartidoService>(PartidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

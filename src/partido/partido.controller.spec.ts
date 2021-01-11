import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
import { PgService } from '../pg/pg.service';
import { PartidoController } from './partido.controller';
import { PartidoService } from './partido.service';

describe('PartidoController', () => {
  let controller: PartidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartidoController],
      providers: [PartidoService, EtcdService, AuthGuard, PgService],
    }).compile();

    controller = module.get<PartidoController>(PartidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

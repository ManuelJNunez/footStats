import { Module } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
import { PgService } from '../pg/pg.service';
import { PartidoController } from './partido.controller';
import { PartidoService } from './partido.service';

@Module({
  controllers: [PartidoController],
  providers: [PartidoService, PgService, EtcdService, AuthGuard],
})
export class PartidoModule {}

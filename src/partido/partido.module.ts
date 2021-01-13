import { Module } from '@nestjs/common';
import { PgModule } from '../pg/pg.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { EtcdService } from '../etcd/etcd.service';
import { PartidoController } from './partido.controller';
import { PartidoService } from './partido.service';

@Module({
  imports: [PgModule],
  controllers: [PartidoController],
  providers: [PartidoService, EtcdService, AuthGuard],
})
export class PartidoModule {}

import { Module } from '@nestjs/common';
import { PgModule } from '../pg/pg.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { EtcdService } from '../etcd/etcd.service';

@Module({
  imports: [PgModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, AuthGuard, EtcdService],
})
export class UsuarioModule {}

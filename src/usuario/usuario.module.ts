import { Module } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { EtcdService } from '../etcd/etcd.service';
import { PgService } from '../pg/pg.service';

@Module({
  // imports: [PgModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, AuthGuard, EtcdService, PgService],
})
export class UsuarioModule {}

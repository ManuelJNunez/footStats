import { Module } from '@nestjs/common';
import { EtcdService } from '../etcd/etcd.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, AuthGuard],
})
export class UsuarioModule {}

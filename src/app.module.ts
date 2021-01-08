import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { JugadaModule } from './jugada/jugada.module';
import { PartidoModule } from './partido/partido.module';
import { EtcdService } from './etcd/etcd.service';
import { PgModule } from './pg/pg.module';

@Module({
  imports: [UsuarioModule, JugadaModule, PartidoModule, ConfigModule, PgModule],
  controllers: [AppController],
  providers: [EtcdService],
})
export class AppModule {}

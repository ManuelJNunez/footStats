import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { JugadaModule } from './jugada/jugada.module';
import { PartidoModule } from './partido/partido.module';
import { EtcdService } from './etcd/etcd.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsuarioModule,
    JugadaModule,
    PartidoModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [EtcdService],
})
export class AppModule {}

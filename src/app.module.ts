import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { JugadaController } from './jugada/jugada.controller';
import { JugadaModule } from './jugada/jugada.module';
import { PartidoModule } from './partido/partido.module';

@Module({
  imports: [ConfigModule.forRoot(), UsuarioModule, JugadaModule, PartidoModule],
  controllers: [AppController, JugadaController],
  providers: [],
})
export class AppModule {}

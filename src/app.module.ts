import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { PartidoModule } from './partido/partido.module';
import { JugadaModule } from './jugada/jugada.module';

@Module({
  imports: [UsuarioModule, PartidoModule, JugadaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

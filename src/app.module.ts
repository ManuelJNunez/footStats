import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { JugadaController } from './jugada/jugada.controller';
import { JugadaModule } from './jugada/jugada.module';
import { PartidoModule } from './partido/partido.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [ConfigModule.forRoot(), UsuarioModule, JugadaModule, PartidoModule],
  controllers: [AppController, JugadaController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

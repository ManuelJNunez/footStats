import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { JugadaModule } from './jugada/jugada.module';
import { PartidoModule } from './partido/partido.module';
import { EtcdService } from './etcd/etcd.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'pg',
        // debug: true,
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          port: parseInt(process.env.DB_PORT),
        },
      },
    }),
    UsuarioModule,
    JugadaModule,
    PartidoModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [EtcdService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}

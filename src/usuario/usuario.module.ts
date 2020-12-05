import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';

@Module({
  controllers: [UsuarioController],
})
export class UsuarioModule {}

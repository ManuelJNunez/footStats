import { Module } from '@nestjs/common';
import { PartidoController } from './partido.controller';

@Module({
  controllers: [PartidoController]
})
export class PartidoModule {}

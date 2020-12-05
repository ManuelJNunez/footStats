import { Module } from '@nestjs/common';
import { JugadaController } from './jugada.controller';

@Module({
  controllers: [JugadaController]
})
export class JugadaModule {}

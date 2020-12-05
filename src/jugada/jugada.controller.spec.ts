import { Test, TestingModule } from '@nestjs/testing';
import { JugadaController } from './jugada.controller';

describe('JugadaController', () => {
  let controller: JugadaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JugadaController],
    }).compile();

    controller = module.get<JugadaController>(JugadaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

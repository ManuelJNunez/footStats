import { Test, TestingModule } from '@nestjs/testing';
import { PartidoController } from './partido.controller';

describe('PartidoController', () => {
  let controller: PartidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartidoController],
    }).compile();

    controller = module.get<PartidoController>(PartidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

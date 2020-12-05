import { Controller, Get } from '@nestjs/common';

@Controller('usuario')
export class UsuarioController {
  @Get()
  getHello(): any {
    return { status: 'Healthy' };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
  Param,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsuarioService } from './usuario.service';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    if (id != decoded.id) {
      throw new UnauthorizedException();
    }

    return await this.usuarioService.findByEmail(decoded.email);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: CreateUserDTO, @Res() res: Response) {
    const response = await this.usuarioService.create(user);

    res.set('Location', `/user/${response.id}`);
    res.json(response);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Headers('Authorization') auth: string,
    @Body() user: CreateUserDTO,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    if (id != decoded.id) {
      throw new UnauthorizedException();
    }

    const response = await this.usuarioService.update(id, user);

    res.set('Location', `/user/${response.id}`);
    res.json(response);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    if (id != decoded.id) {
      throw new UnauthorizedException();
    }

    return {
      message: 'Usuario eliminado con éxito',
      user: await this.usuarioService.delete(id),
    };
  }

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDTO) {
    return {
      message: 'Logeado con éxito',
      token: await this.usuarioService.generarToken(loginDto),
    };
  }
}

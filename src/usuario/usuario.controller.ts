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
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsuarioService } from './usuario.service';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Headers('Authorization') auth: string) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return await this.usuarioService.findByEmail(decoded.email);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: CreateUserDTO) {
    return {
      message: 'Usuario registrado con éxito',
      user: await this.usuarioService.create(user),
    };
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Headers('Authorization') auth: string,
    @Body() user: CreateUserDTO,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return {
      message: 'Usuario modificado con éxito',
      user: await this.usuarioService.update(decoded.userId, user),
    };
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@Headers('Authorization') auth: string) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return {
      message: 'Usuario eliminado con éxito',
      user: await this.usuarioService.delete(decoded.userId),
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

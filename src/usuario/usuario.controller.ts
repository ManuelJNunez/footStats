import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
  getUser(@Headers('Authorization') auth: string) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return this.usuarioService.findByEmail(decoded.email);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDTO) {
    return {
      message: 'Usuario registrado con éxito',
      user: this.usuarioService.create(user),
    };
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateUser(
    @Headers('Authorization') auth: string,
    @Body() user: CreateUserDTO,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return {
      message: 'Usuario modificado con éxito',
      user: this.usuarioService.update(decoded.id, user),
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: number) {
    return {
      message: 'Usuario eliminado con éxito',
      user: this.usuarioService.delete(id),
    };
  }

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  login(@Body() loginDto: LoginDTO) {
    return {
      message: 'Logeado con éxito',
      token: this.usuarioService.generarToken(loginDto),
    };
  }
}

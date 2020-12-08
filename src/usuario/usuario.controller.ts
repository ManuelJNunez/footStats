import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsuarioService } from './usuario.service';

@Controller('user')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @UseGuards(new AuthGuard())
  getUser(@Body('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDTO) {
    return {
      message: 'Usuario registrado con éxito',
      user: this.usuarioService.create(user),
    };
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id') id: number, @Body() user: CreateUserDTO) {
    return {
      message: 'Usuario modificado con éxito',
      user: this.usuarioService.update(id, user),
    };
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteUser(@Param('id') id: number) {
    return {
      message: 'Usuario eliminado con éxito',
      user: this.usuarioService.delete(id),
    };
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginDto: LoginDTO) {
    return {
      message: 'Logeado con éxito',
      token: this.usuarioService.generarToken(loginDto),
    };
  }
}

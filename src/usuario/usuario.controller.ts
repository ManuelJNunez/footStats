import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsuarioService } from './usuario.service';

@Controller('user')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  getUser(@Body('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDto) {
    return {
      message: 'Usuario registrado con éxito',
      user: this.usuarioService.create(user),
    };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id') id: number, @Body() user: CreateUserDto) {
    return {
      message: 'Usuario modificado con éxito',
      user: this.usuarioService.update(id, user),
    };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return {
      message: 'Usuario eliminado con éxito',
      user: this.usuarioService.delete(id),
    };
  }
}

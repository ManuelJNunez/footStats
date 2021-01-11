import {
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
  Get,
  Put,
  Param,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateMatchDTO } from './dto/create-match.dto';
import { PartidoService } from './partido.service';
import * as jwt from 'jsonwebtoken';

@Controller('matches')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Headers('Authorization') auth: string,
    @Body() match: CreateMatchDTO,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return await this.partidoService.create(match, decoded.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getMatch(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return await this.partidoService.findById(decoded.userId, id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getMatches(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });
    const userid = decoded.userId;

    if (userid != id) {
      throw new UnauthorizedException();
    }

    return await this.partidoService.findMatchesOfUser(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateMatch(
    @Headers('Authorization') auth: string,
    @Body() matchDto: CreateMatchDTO,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });
    const userid = decoded.userId;

    return {
      message: 'Partido actualizado con éxito',
      match: await this.partidoService.update(matchDto, id, userid),
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteMatch(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });
    const userid = decoded.userId;

    return {
      message: 'Usuario eliminado con éxito',
      match: await this.partidoService.delete(id, userid),
    };
  }
}

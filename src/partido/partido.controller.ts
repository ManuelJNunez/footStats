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
  Res,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateMatchDTO } from './dto/create-match.dto';
import { PartidoService } from './partido.service';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

@Controller('matches')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    //@Headers('Authorization') auth: string,
    @Body() match: CreateMatchDTO,
    @Res() res: Response,
  ) {
    //const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    const response = await this.partidoService.create(match); //decoded.id);

    res.set('Location', `/matches/${response.id}`);
    res.json(response);
  }

  @Get(':id')
  //@UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getMatch(
    //@Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    //const decoded = jwt.decode(auth.split(' ')[1], { json: true });

    return await this.partidoService.findById(/*decoded.id,*/ id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getMatches(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });
    const userid = decoded.id;

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
    @Res() res: Response,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });
    const userid = decoded.id;
    const response = await this.partidoService.update(matchDto, id, userid);

    res.set('Location', `/matches/${id}`);
    res.json(response); //, userid),
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteMatch(
    @Headers('Authorization') auth: string,
    @Param('id') id: number,
  ) {
    const decoded = jwt.decode(auth.split(' ')[1], { json: true });
    const userid = decoded.id;

    return {
      message: 'Partido eliminado con éxito',
      match: await this.partidoService.delete(id, userid),
    };
  }
}

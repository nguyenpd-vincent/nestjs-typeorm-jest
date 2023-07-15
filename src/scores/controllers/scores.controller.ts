import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScoresService } from '../services/scores.service';
import { CreateScoreDto } from '../dto/create-score.dto';
import { PaginationQuery } from '../dto/find-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.create(createScoreDto);
  }
  @Get('/history')
  historyScore(@Query('player') player: string) {
    return this.scoresService.history(player);
  }
  @Get()
  findAll(@Query() query: PaginationQuery) {
    return this.scoresService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.scoresService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.scoresService.remove(id);
  }
}

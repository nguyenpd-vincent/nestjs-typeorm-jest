import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScoreDto } from '../dto/create-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { Score } from '../entities/score.entity';
import { PaginationQuery } from '../dto/find-score.dto';
import {
  HistoryScoreResponse,
  PaginateScores,
  ResponseSuccess,
} from '../models/score.interface';
import { InforScore } from '../models/score.interface';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
  ) {}
  async create(createScoreDto: CreateScoreDto) {
    try {
      return await this.scoreRepository.save(createScoreDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'cannot create score',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(query: PaginationQuery): Promise<PaginateScores> {
    try {
      const { page = 1, limit = 10, sort = 'ASC', startDate, endDate } = query;
      const playerArr = query.players?.split(',');
      let createdAt = null;
      if (startDate && !endDate) {
        createdAt = MoreThan(startDate);
      } else if (endDate && !startDate) {
        createdAt = LessThan(endDate);
      } else if (startDate && endDate) {
        createdAt = Between(new Date(startDate), new Date(endDate));
      }

      const where: FindOptionsWhere<Score> = {};
      if (playerArr) {
        where.player = In(playerArr);
      }
      if (createdAt) {
        where.createdAt = createdAt;
      }
      const [players, total] = await this.scoreRepository.findAndCount({
        where,
        order: { id: sort },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        players,
        total,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error ? `${error}` : `cannot get paginate players`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: number): Promise<Score> {
    try {
      const score = await this.scoreRepository.findOne({ where: { id } });
      if (!score) {
        throw new NotFoundException('Score not found');
      }

      return score;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error ? `${error}` : `cannot get score with id:${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async history(player: string): Promise<HistoryScoreResponse> {
    let playersNotFound = false;
    try {
      const players = await this.scoreRepository.find({
        where: { player },
      });
      if (!players || players.length < 1) {
        playersNotFound = true;
      }
      const maxScoreObject = players.reduce((max, obj) =>
        obj.score > max.score ? obj : max,
      );
      const minScoreObject = players.reduce((min, obj) =>
        obj.score < min.score ? obj : min,
      );

      const sum = players.reduce((total, obj) => total + obj.score, 0);
      const averageScore = sum / players.length;
      const filteredScores: InforScore[] = players.map(
        ({ score, createdAt }) => ({
          score,
          createdAt: createdAt,
        }),
      );
      return {
        lowScore: {
          score: minScoreObject.score,
          createdAt: minScoreObject.createdAt,
        },
        topScore: {
          score: maxScoreObject.score,
          createdAt: maxScoreObject.createdAt,
        },
        averageScore: averageScore,
        scores: filteredScores,
      };
    } catch (error) {
      if (playersNotFound) {
        throw new NotFoundException(`Not found player with ${player}`);
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error
            ? `${error}`
            : `cannot get history with player: ${player}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async remove(id: number): Promise<ResponseSuccess> {
    try {
      const score = await this.scoreRepository.findOne({ where: { id } });
      if (!score) {
        throw new NotFoundException('Score not found');
      }
      await this.scoreRepository.delete(id);
      return {
        success: true,
        message: 'delete success!',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error ? `${error}` : `cannot delete score with id:${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ScoresController } from './scores.controller';
import { ScoresService } from '../services/scores.service';
import { Score } from '../entities/score.entity';
import { CreateScoreDto } from '../dto/create-score.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaginateScores, ResponseSuccess } from '../models/score.interface';
import { PaginationQuery, SortOrder } from '../dto/find-score.dto';
describe('ScoresController', () => {
  let scoresController: ScoresController;
  let scoresService: ScoresService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoresController],
      providers: [
        {
          provide: ScoresService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            history: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    scoresController = module.get<ScoresController>(ScoresController);
    scoresService = module.get<ScoresService>(ScoresService);
  });

  describe('create', () => {
    it('should create a new score', async () => {
      const createScoreDto: CreateScoreDto = {
        player: 'nguyenpd',
        score: 100,
      };
      const createdScore: any = {
        id: 1,
        player: 'nguyenpd',
        score: 100,
      };

      jest.spyOn(scoresService, 'create').mockResolvedValueOnce(createdScore);

      const scored = await scoresController.create(createScoreDto);

      expect(scored).toBe(createdScore);
      expect(scoresService.create).toHaveBeenCalledWith(createScoreDto);
    });

    it('should call create failured with invalid', async () => {
      const createScoreDto: CreateScoreDto = {
        player: '',
        score: 100,
      };
      const error = new HttpException(
        'Http Exception',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      jest.spyOn(scoresService, 'create').mockRejectedValue(error);

      await expect(
        scoresController.create(createScoreDto),
      ).rejects.toThrowError(HttpException);
      await expect(
        scoresController.create(createScoreDto),
      ).rejects.toThrowError(HttpException);

      expect(scoresService.create).toHaveBeenCalledWith(createScoreDto);
    });
  });

  describe('getOne', () => {
    const id = 1;
    it('should get success a  score', async () => {
      const mockScore: Score = {
        id: id,
        player: 'nguyenpd',
        score: 100,
      };

      jest.spyOn(scoresService, 'findOne').mockResolvedValue(mockScore);

      const scored = await scoresController.findOne(id);

      expect(scored).toBe(mockScore);
      expect(scoresService.findOne).toHaveBeenCalledWith(id);
    });

    it('should call get failured a score', async () => {
      const error = new HttpException(
        'Http Exception',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(scoresService, 'findOne').mockRejectedValue(error);

      await expect(scoresController.findOne(id)).rejects.toThrowError(
        HttpException,
      );

      expect(scoresService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    const id = 1;
    it('should remove success a  score', async () => {
      const mockScoreReponse: ResponseSuccess = {
        success: true,
        message: 'delete success!',
      };

      jest.spyOn(scoresService, 'remove').mockResolvedValue(mockScoreReponse);

      const removedScore = await scoresController.remove(id);

      expect(removedScore).toBe(mockScoreReponse);
      expect(scoresService.remove).toHaveBeenCalledWith(id);
    });

    it('should call remove failured a score', async () => {
      const error = new HttpException(
        'Http Exception',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(scoresService, 'remove').mockRejectedValue(error);

      await expect(scoresController.remove(id)).rejects.toThrowError(
        HttpException,
      );

      expect(scoresService.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('histtory', () => {
    const player = 'nguyenpd';
    it(`should get success history of player's score`, async () => {
      const mockScoreHistory = {
        lowScore: {
          score: 5,
          createdAt: new Date('2023-07-12T18:06:48.831Z'),
        },
        topScore: {
          score: 109,
          createdAt: new Date('2023-07-12T20:18:35.208Z'),
        },
        averageScore: 74.33333333333333,
        scores: [
          {
            score: 5,
            createdAt: new Date('2023-07-12T18:06:48.831Z'),
          },
          {
            score: 109,
            createdAt: new Date('2023-07-12T20:18:35.208Z'),
          },
          {
            score: 109,
            createdAt: new Date('2023-07-13T08:02:39.603Z'),
          },
        ],
      };

      jest.spyOn(scoresService, 'history').mockResolvedValue(mockScoreHistory);

      const historyScore = await scoresController.historyScore(player);

      expect(historyScore).toBe(mockScoreHistory);
      expect(scoresService.history).toHaveBeenCalledWith(player);
    });

    it(`should get failured history of player's score by reason not have scores with player`, async () => {
      const error = new HttpException(
        'Http Exception',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(scoresService, 'history').mockRejectedValue(error);

      await expect(scoresController.historyScore(player)).rejects.toThrowError(
        HttpException,
      );

      expect(scoresService.history).toHaveBeenCalledWith(player);
    });
  });

  describe('findAll', () => {
    const query: PaginationQuery = {
      players: 'nguyen, nguyenpd',
      startDate: '2023-01-13 05:06:12',
      endDate: '2023-08-13 05:06:12',
      sort: SortOrder.ASC,
    };

    it('find success user by player name, startDate and endDate', async () => {
      const mockScores: PaginateScores = {
        players: [
          {
            id: 10,
            player: 'nguyenpd',
            score: 5,
            createdAt: new Date('2023-07-12T18:06:48.831Z'),
            updatedAt: new Date('2023-07-13T00:58:05.979Z'),
            deletedAt: null,
          },
          {
            id: 12,
            player: 'nguyenpd',
            score: 109,
            createdAt: new Date('2023-07-12T20:18:35.208Z'),
            updatedAt: new Date('2023-07-13T00:58:05.979Z'),
            deletedAt: null,
          },
          {
            id: 13,
            player: 'nguyen',
            score: 109,
            createdAt: new Date('2023-07-13T08:02:39.603Z'),
            updatedAt: new Date('2023-07-13T08:02:39.603Z'),
            deletedAt: null,
          },
        ],
        total: 3,
      };

      jest.spyOn(scoresService, 'findAll').mockResolvedValue(mockScores);

      const scorePagination = await scoresController.findAll(query);

      expect(scorePagination).toBe(mockScores);
      expect(scoresService.findAll).toHaveBeenCalledWith(query);
    });

    it('find failured user by player name, startDate and endDate', async () => {
      const error = new HttpException(
        'Http Exception',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(scoresService, 'findAll').mockRejectedValue(error);

      await expect(scoresController.findAll(query)).rejects.toThrowError(
        HttpException,
      );

      expect(scoresService.findAll).toHaveBeenCalledWith(query);
    });
  });
});

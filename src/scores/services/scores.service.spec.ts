import { Test, TestingModule } from '@nestjs/testing';
import { ScoresService } from './scores.service';
import { Between, In, Repository } from 'typeorm';
import { Score } from '../entities/score.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateScoreDto } from '../dto/create-score.dto';
import { HttpException, NotFoundException } from '@nestjs/common';
import { PaginateScores } from '../models/score.interface';
import { PaginationQuery, SortOrder } from '../dto/find-score.dto';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
describe('ScoresService', () => {
  let scoreService: ScoresService;
  let scoreRepository: MockType<Repository<Score>>;

  const mockScoreRepository = {
    save: jest
      .fn()
      .mockImplementation((score: Score) =>
        Promise.resolve({ id: 1, ...score }),
      ),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockScoreRepository,
        },
      ],
    }).compile();

    scoreService = module.get<ScoresService>(ScoresService);
    scoreRepository = module.get(getRepositoryToken(Score));
  });

  describe('create', () => {
    it('should call create success score', async () => {
      const mockScoreSuccess: CreateScoreDto = {
        player: 'nguyenpd',
        score: 100,
      };
      scoreRepository.save.mockResolvedValue(mockScoreSuccess as never);

      const createdScore = await scoreService.create(mockScoreSuccess);
      expect(scoreRepository.save).toHaveBeenCalledWith(mockScoreSuccess);
      expect(createdScore).toEqual(mockScoreSuccess);
    });

    it('should call create failured with invalid', async () => {
      const mockScoreInvalidPlayer: CreateScoreDto = {
        player: '',
        score: 0,
      };
      scoreRepository.save.mockRejectedValue(new Error() as never);
      await expect(
        scoreService.create(mockScoreInvalidPlayer),
      ).rejects.toThrowError(HttpException);
    });
  });

  describe('getOne', () => {
    const id = 1;
    it('should call get success a score', async () => {
      const mockScore: Score = {
        id: id,
        player: 'nguyenpd',
        score: 100,
      };
      scoreRepository.findOne.mockResolvedValue(mockScore as never);

      const score = await scoreService.findOne(id);
      expect(scoreRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(score).toEqual(mockScore);
    });

    it('should call get failured a score', async () => {
      scoreRepository.findOne.mockRejectedValue(new Error() as never);

      await expect(scoreService.findOne(id)).rejects.toThrow(HttpException);
      expect(scoreRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('remove', () => {
    const id = 1;
    it('should call remove success a score', async () => {
      const mocksScore: Score = {
        id,
        player: 'nguyenpd',
        score: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      scoreRepository.findOne.mockResolvedValue(mocksScore as never);
      scoreRepository.delete.mockResolvedValue(undefined as never);

      const score = await scoreService.remove(id);

      expect(scoreRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(scoreRepository.delete).toHaveBeenCalledWith(id);
      expect(score.success).toEqual(true);
    });

    it('should call remove failured a score', async () => {
      scoreRepository.findOne.mockResolvedValue(undefined as never);
      await expect(scoreService.remove(id)).rejects.toThrow(HttpException);
    });
  });

  describe('history', () => {
    const player = 'nguyenpd';
    it(`should get success history of player's score`, async () => {
      const mockScores = [
        {
          id: 10,
          player: 'nguyenpd',
          score: 5,
          createdAt: '2023-07-12T18:06:48.831Z',
          updatedAt: '2023-07-13T00:58:05.979Z',
          deletedAt: null,
        },
        {
          id: 12,
          player: 'nguyenpd',
          score: 109,
          createdAt: '2023-07-12T20:18:35.208Z',
          updatedAt: '2023-07-13T00:58:05.979Z',
          deletedAt: null,
        },
        {
          id: 13,
          player: 'nguyenpd',
          score: 109,
          createdAt: '2023-07-13T08:02:39.603Z',
          updatedAt: '2023-07-13T08:02:39.603Z',
          deletedAt: null,
        },
      ];
      const mockScoreHistory = {
        lowScore: {
          score: 5,
          createdAt: '2023-07-12T18:06:48.831Z',
        },
        topScore: {
          score: 109,
          createdAt: '2023-07-12T20:18:35.208Z',
        },
        averageScore: 74.33333333333333,
        scores: [
          {
            score: 5,
            createdAt: '2023-07-12T18:06:48.831Z',
          },
          {
            score: 109,
            createdAt: '2023-07-12T20:18:35.208Z',
          },
          {
            score: 109,
            createdAt: '2023-07-13T08:02:39.603Z',
          },
        ],
      };
      scoreRepository.find.mockResolvedValue(mockScores as never);
      const history = await scoreService.history(player);
      expect(scoreRepository.find).toHaveBeenCalledWith({
        where: { player },
      });
      expect(history).toEqual(mockScoreHistory);
    });

    it(`should get failured history of player's score by reason not have scores with player`, async () => {
      const mockScores: Score[] = [];

      scoreRepository.find.mockResolvedValue(mockScores as never);

      await expect(scoreService.history(player)).rejects.toThrow(
        NotFoundException,
      );
      expect(scoreRepository.find).toHaveBeenCalledWith({
        where: { player },
      });
    });

    it(`should get failured history of player's score by reason error when execute`, async () => {
      scoreRepository.find.mockRejectedValue(new Error() as never);

      await expect(scoreService.history(player)).rejects.toThrow(HttpException);
      expect(scoreRepository.find).toHaveBeenCalledWith({
        where: { player },
      });
    });
  });

  describe('findAll', () => {
    const query: PaginationQuery = {
      players: 'nguyen, nguyenpd',
      startDate: '2023-01-13 05:06:12',
      endDate: '2023-08-13 05:06:12',
      sort: SortOrder.ASC,
    };
    const playersArr = query.players.split(',');

    it('find success user by player name, startDate and endDate', async () => {
      const mockScores = [
        [
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
        3,
      ];
      const mockResultScores: PaginateScores = {
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
      scoreRepository.findAndCount.mockResolvedValue(mockScores as never);

      const scoresPagination = await scoreService.findAll(query);

      expect(scoreRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          player: In(playersArr),
          createdAt: Between(
            new Date(query.startDate),
            new Date(query.endDate),
          ),
        },
        order: { id: 'asc' },
        skip: 0,
        take: 10,
      });
      expect(scoresPagination).toEqual(mockResultScores);
    });

    it('find failured user by player name, startDate and endDate', () => {
      scoreRepository.findAndCount.mockRejectedValue(new Error() as never);

      expect(scoreService.findAll(query)).rejects.toThrow(HttpException);
      expect(scoreRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          player: In(playersArr),
          createdAt: Between(
            new Date(query.startDate),
            new Date(query.endDate),
          ),
        },
        order: { id: 'asc' },
        skip: 0,
        take: 10,
      });
    });
  });
});

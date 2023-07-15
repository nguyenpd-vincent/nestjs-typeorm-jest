import { Score } from '../entities/score.entity';

export interface PaginateScores {
  players?: Score[];
  total: number;
}

export interface InforScore {
  score: number;
  createdAt: Date;
}

export interface HistoryScoreResponse {
  topScore: InforScore;
  lowScore: InforScore;
  averageScore: number;
  scores: InforScore[];
}

export interface ResponseSuccess {
  success: boolean;
  message: string;
}

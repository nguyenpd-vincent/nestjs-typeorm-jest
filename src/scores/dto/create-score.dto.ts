import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class CreateScoreDto {
  @IsNotEmpty()
  @IsString({ each: true })
  @Matches('^[a-zA-Z ]*$')
  player: string;

  @IsInt()
  @Min(1, {
    message: 'score min 1',
  })
  score: number;
}

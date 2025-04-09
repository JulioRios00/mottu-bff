import { Injectable } from '@nestjs/common';
import { CatsService } from '../../cats/services/cats.service';
import { RickService } from '../../rickandmorty/services/rick-and-morty.service';
import { PairResponseDto, PairSearchQueryDto } from '../dtos/pairs-response.dto';

@Injectable()
export class PairsService {
  constructor(
    private readonly catsService: CatsService,
    private readonly rickService: RickService,
  ) {}

  async getRandomPair(): Promise<PairResponseDto> {
    const [character, cat] = await Promise.all([
      this.rickService.getRandomCharacter(),
      this.catsService.getRandomCat(),
    ]);

    return { character, cat };
  }

  async searchPairs(query: PairSearchQueryDto): Promise<PairResponseDto> {
    const [character, cat] = await Promise.all([
      this.rickService.getRandomCharacter(query.characterName),
      this.catsService.getRandomCat(query.catBreed),
    ]);

    return { character, cat };
  }
}
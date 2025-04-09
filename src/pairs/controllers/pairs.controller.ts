import { Controller, Get, Query } from '@nestjs/common';
import { PairsService } from '../services/pairs.service';
import { PairResponseDto } from '../dtos/pairs-response.dto';

@Controller('v1/pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  async getRandomPair(): Promise<PairResponseDto> {
    return this.pairsService.getRandomPair();
  }

  @Get('search')
  async searchPairs(
    @Query('characterName') characterName?: string,
    @Query('catBreed') catBreed?: string,
  ): Promise<PairResponseDto[]> {
    return this.pairsService.searchPairs(characterName, catBreed);
  }
}
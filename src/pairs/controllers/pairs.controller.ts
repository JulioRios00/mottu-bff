import { Controller, Get, Query } from '@nestjs/common';
import { PairsService } from '../services/pairs.service';
import { PairResponseDto, PairSearchQueryDto } from '../dtos/pairs-response.dto';

@Controller('v1/pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  async getRandomPair(): Promise<PairResponseDto> {
    return this.pairsService.getRandomPair();
  }

  @Get('search')
  async searchPairs(
    @Query() query: PairSearchQueryDto,
  ): Promise<PairResponseDto> {
    return this.pairsService.searchPairs(query);
  }
}
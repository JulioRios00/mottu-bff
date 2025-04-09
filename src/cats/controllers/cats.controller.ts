import { Controller, Get, Query } from '@nestjs/common';
import { CatsService } from '../services/cats.service';
import { CatResponseDto, BreedResponseDto } from '../dtos/cats-response.dto';

@Controller('v1/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async getRandomCat(@Query('breed') breedId?: string): Promise<CatResponseDto> {
    return this.catsService.getRandomCat(breedId);
  }

  @Get('breeds')
  async getBreeds(): Promise<BreedResponseDto[]> {
    return this.catsService.getBreeds();
  }
}
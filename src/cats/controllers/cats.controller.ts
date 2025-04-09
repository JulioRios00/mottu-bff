import { Controller, Get } from '@nestjs/common';
import { CatsService } from '../services/cats.service';
import { BreedResponseDto } from '../dtos/cats-response.dto';

@Controller('v1')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('breeds')
  async getBreeds(): Promise<BreedResponseDto[]> {
    return this.catsService.getBreeds();
  }
}
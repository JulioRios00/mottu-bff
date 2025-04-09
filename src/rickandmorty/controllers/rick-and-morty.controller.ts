import { Controller, Get, Query } from '@nestjs/common';
import { RickService } from '../services/rick-and-morty.service';
import { RickAndMortyResponseDto } from '../dtos/rick-and-morty-response';

@Controller('v1/characters')
export class RickController {
  constructor(private readonly rickService: RickService) {}

  @Get()
  async getRandomCharacter(@Query('name') name?: string): Promise<RickAndMortyResponseDto> {
    return this.rickService.getRandomCharacter(name);
  }
}
import { Controller, Get, Query } from '@nestjs/common';
import { CharacterService } from '../services/character.service';
import { CharacterResponseDto } from '../dtos/character-response';

@Controller('v1/characters')
export class CharacterController {
  constructor(private readonly rickAndMortyService: CharacterService) {}

  @Get('random')
  async getRandomCharacter(): Promise<CharacterResponseDto> {
    return this.rickAndMortyService.getRandomCharacter();
  }

  @Get('search')
  async searchCharacters(@Query('name') name: string): Promise<CharacterResponseDto[]> {
    return this.rickAndMortyService.searchCharacters(name);
  }
}
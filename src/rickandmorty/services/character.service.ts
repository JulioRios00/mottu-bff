import { Injectable, NotFoundException } from '@nestjs/common';
import { CharacterAdapter } from '../adapters/character.adapter';
import { CharacterResponseDto } from '../dtos/character-response';
import { CacheService } from '../../shared/cache.service';

@Injectable()
export class CharacterService {
  constructor(
    private readonly CharacterAdapter: CharacterAdapter,
    private readonly cacheService: CacheService
  ) {}

  async getRandomCharacter(): Promise<CharacterResponseDto> {
    const cacheKey = 'character:random:any';
    const cachedCharacter = await this.cacheService.get<CharacterResponseDto>(cacheKey);
    
    if (cachedCharacter) {
      return cachedCharacter;
    }

    const character = await this.CharacterAdapter.getRandomCharacter();
    await this.cacheService.set(cacheKey, character, 3600); 
    
    return character;
  }

  async searchCharacters(name: string): Promise<CharacterResponseDto[]> {
    if (!name) {
      return [];
    }
    
    const cacheKey = `character:search:${name}`;
    const cachedResults = await this.cacheService.get<CharacterResponseDto[]>(cacheKey);
    
    if (cachedResults) {
      return cachedResults;
    }
    
    const characters = await this.CharacterAdapter.searchCharacters(name);
    
    if (!characters || characters.length === 0) {
      return [];
    }
    
    await this.cacheService.set(cacheKey, characters, 3600); 
    
    return characters;
  }
}
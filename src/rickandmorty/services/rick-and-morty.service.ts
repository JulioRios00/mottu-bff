import { Injectable } from '@nestjs/common';
import { RickApiAdapter } from '../adapters/rick-and-morty.adapter';
import { RickAndMortyResponseDto } from '../dtos/rick-and-morty-response';
import { CacheService } from '../../shared/cache.service';

@Injectable()
export class RickService {
  constructor(
    private readonly rickApiAdapter: RickApiAdapter,
    private readonly cacheService: CacheService,
  ) {}

  async getRandomCharacter(name?: string): Promise<RickAndMortyResponseDto> {
    const cacheKey = `character:random:${name || 'any'}`;
    const cachedCharacter = await this.cacheService.get<RickAndMortyResponseDto>(cacheKey);
    
    if (cachedCharacter) {
      return cachedCharacter;
    }

    const character = await this.rickApiAdapter.getRandomCharacter(name);
    await this.cacheService.set(cacheKey, character, 3600);
    
    return character;
  }
}
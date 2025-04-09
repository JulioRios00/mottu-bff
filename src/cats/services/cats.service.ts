import { Injectable } from '@nestjs/common';
import { CatApiAdapter } from '../adapters/cats-api.adapter';
import { CatResponseDto, BreedResponseDto } from '../dtos/cats-response.dto';
import { CacheService } from '../../shared/cache.service';

@Injectable()
export class CatsService {
  constructor(
    private readonly catApiAdapter: CatApiAdapter,
    private readonly cacheService: CacheService
  ) {}

  async getRandomCat(breedId?: string): Promise<CatResponseDto> {
    const cacheKey = `cat:random:${breedId || 'any'}`;
    const cachedCat = await this.cacheService.get<CatResponseDto>(cacheKey);
    
    if (cachedCat) {
      return cachedCat;
    }

    const cat = await this.catApiAdapter.getRandomCat(breedId);
    await this.cacheService.set(cacheKey, cat, 3600); // Cache for 1 hour
    
    return cat;
  }

  async getBreeds(): Promise<BreedResponseDto[]> {
    const cacheKey = 'cat:breeds';
    const cachedBreeds = await this.cacheService.get<BreedResponseDto[]>(cacheKey);
    
    if (cachedBreeds) {
      return cachedBreeds;
    }

    const breeds = await this.catApiAdapter.getBreeds();
    await this.cacheService.set(cacheKey, breeds, 86400); // Cache for 24 hours
    
    return breeds;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { CatApiAdapter } from '../adapters/cats-api.adapter';
import { CatResponseDto, BreedResponseDto } from '../dtos/cats-response.dto';
import { CacheService } from '../../shared/cache.service';

@Injectable()
export class CatsService {
  constructor(
    private readonly catApiAdapter: CatApiAdapter,
    private readonly cacheService: CacheService
  ) {}

  async getRandomCat(breedName?: string): Promise<CatResponseDto> {
    let breedId: string | undefined = undefined;
    
    if (breedName) {
      const breeds = await this.getBreeds();
      const breed = breeds.find(b => 
        b.name.toLowerCase() === breedName.toLowerCase()
      );
      
      if (breed) {
        breedId = breed.id;
      } else {
        const matchingBreed = breeds.find(b => 
          b.name.toLowerCase().includes(breedName.toLowerCase())
        );
        
        if (matchingBreed) {
          breedId = matchingBreed.id;
        }
      }
    }
    
    const cacheKey = `cat:random:${breedId || 'any'}`;
    const cachedCat = await this.cacheService.get<CatResponseDto>(cacheKey);
    
    if (cachedCat) {
      return cachedCat;
    }

    const cat = await this.catApiAdapter.getRandomCat(breedId);
    await this.cacheService.set(cacheKey, cat, 3600); 
    return cat;
  }

  async getBreeds(): Promise<BreedResponseDto[]> {
    const cacheKey = 'cat:breeds';
    const cachedBreeds = await this.cacheService.get<BreedResponseDto[]>(cacheKey);
    
    if (cachedBreeds) {
      return cachedBreeds;
    }

    const breeds = await this.catApiAdapter.getBreeds();
    await this.cacheService.set(cacheKey, breeds, 86400); 
    return breeds;
  }
}

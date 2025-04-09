import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from '../../../src/cats/services/cats.service';
import { CatApiAdapter } from '../../../src/cats/adapters/cats-api.adapter';
import { CacheService } from '../../../src/shared/cache.service';
import { CatResponseDto, BreedResponseDto } from '../../../src/cats/dtos/cats-response.dto';

describe('CatsService', () => {
  let service: CatsService;
  let catApiAdapter: CatApiAdapter;
  let cacheService: CacheService;

  const mockCat: CatResponseDto = {
    id: 'abc123',
    image: 'https://example.com/cat.jpg',
  };

  const mockBreeds: BreedResponseDto[] = [
    { id: 'siam', name: 'Siamese', },
    { id: 'beng', name: 'Bengal'},
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: CatApiAdapter,
          useValue: {
            getRandomCat: jest.fn(),
            getBreeds: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    catApiAdapter = module.get<CatApiAdapter>(CatApiAdapter);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomCat', () => {
    it('should return cached cat if available', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(mockCat);
      
      const result = await service.getRandomCat();
      
      expect(cacheService.get).toHaveBeenCalledWith('cat:random:any');
      expect(catApiAdapter.getRandomCat).not.toHaveBeenCalled();
      expect(result).toEqual(mockCat);
    });

    it('should fetch and cache cat if not in cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(catApiAdapter, 'getRandomCat').mockResolvedValue(mockCat);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);
      
      const result = await service.getRandomCat();
      
      expect(cacheService.get).toHaveBeenCalledWith('cat:random:any');
      expect(catApiAdapter.getRandomCat).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('cat:random:any', mockCat, 3600);
      expect(result).toEqual(mockCat);
    });

    it('should use breedId in cache key and API call when provided', async () => {
      // Mock getBreeds to return the mock breeds
      jest.spyOn(service, 'getBreeds').mockResolvedValue(mockBreeds);
      
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(catApiAdapter, 'getRandomCat').mockResolvedValue(mockCat);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);
      
      const result = await service.getRandomCat('Siamese');
      
      expect(service.getBreeds).toHaveBeenCalled();
      expect(cacheService.get).toHaveBeenCalledWith('cat:random:siam');
      expect(catApiAdapter.getRandomCat).toHaveBeenCalledWith('siam');
      expect(cacheService.set).toHaveBeenCalledWith('cat:random:siam', mockCat, 3600);
      expect(result).toEqual(mockCat);
    });
  });

  describe('getBreeds', () => {
    it('should return cached breeds if available', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(mockBreeds);
      
      const result = await service.getBreeds();
      
      expect(cacheService.get).toHaveBeenCalledWith('cat:breeds');
      expect(catApiAdapter.getBreeds).not.toHaveBeenCalled();
      expect(result).toEqual(mockBreeds);
    });

    it('should fetch and cache breeds if not in cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(catApiAdapter, 'getBreeds').mockResolvedValue(mockBreeds);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);
      
      const result = await service.getBreeds();
      
      expect(cacheService.get).toHaveBeenCalledWith('cat:breeds');
      expect(catApiAdapter.getBreeds).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('cat:breeds', mockBreeds, 86400);
      expect(result).toEqual(mockBreeds);
    });
  });
});
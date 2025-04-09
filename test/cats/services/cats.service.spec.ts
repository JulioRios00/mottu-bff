import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from 'src/cats/services/cats.service';
import { CatApiAdapter } from 'src/cats/adapters/cats-api.adapter';
import { CacheService } from 'src/shared/cache.service';
import { CatResponseDto, BreedResponseDto } from 'src/cats/dtos/cats-response.dto';

describe('CatsService', () => {
  let service: CatsService;
  let catApiAdapter: CatApiAdapter;
  let cacheService: CacheService;

  const mockCat: CatResponseDto = {
    id: 'id',
    image: 'https://example.com/cat.jpg',
  };

  const mockBreeds: BreedResponseDto[] = [
    { id: 'breed1', name: 'Vira lata' },
    { id: 'breed2', name: 'Persa' },
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
      
      expect(result).toEqual(mockCat);
      expect(cacheService.get).toHaveBeenCalledWith('cat:random:any');
      expect(catApiAdapter.getRandomCat).not.toHaveBeenCalled();
    });

    it('should fetch and cache a new cat if not in cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(catApiAdapter, 'getRandomCat').mockResolvedValue(mockCat);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getRandomCat();
      
      expect(result).toEqual(mockCat);
      expect(cacheService.get).toHaveBeenCalledWith('cat:random:any');
      expect(catApiAdapter.getRandomCat).toHaveBeenCalledWith(undefined);
      expect(cacheService.set).toHaveBeenCalledWith('cat:random:any', mockCat, 3600);
    });

    it('should use breedId in cache key and API call when provided', async () => {
      const breedId = 'siamese';
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(catApiAdapter, 'getRandomCat').mockResolvedValue(mockCat);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getRandomCat(breedId);
      
      expect(result).toEqual(mockCat);
      expect(cacheService.get).toHaveBeenCalledWith(`cat:random:${breedId}`);
      expect(catApiAdapter.getRandomCat).toHaveBeenCalledWith(breedId);
      expect(cacheService.set).toHaveBeenCalledWith(`cat:random:${breedId}`, mockCat, 3600);
    });
  });

  describe('getBreeds', () => {
    it('should return cached breeds if available', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(mockBreeds);

      const result = await service.getBreeds();
      
      expect(result).toEqual(mockBreeds);
      expect(cacheService.get).toHaveBeenCalledWith('cat:breeds');
      expect(catApiAdapter.getBreeds).not.toHaveBeenCalled();
    });

    it('should fetch and cache breeds if not in cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(catApiAdapter, 'getBreeds').mockResolvedValue(mockBreeds);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getBreeds();
      
      expect(result).toEqual(mockBreeds);
      expect(cacheService.get).toHaveBeenCalledWith('cat:breeds');
      expect(catApiAdapter.getBreeds).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('cat:breeds', mockBreeds, 86400);
    });
  });
});
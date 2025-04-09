import { Test, TestingModule } from '@nestjs/testing';
import { RickService } from 'src/rickandmorty/services/rick-and-morty.service';
import { RickApiAdapter } from 'src/rickandmorty/adapters/rick-and-morty.adapter';
import { CacheService } from '../../../src/shared/cache.service';
import { RickAndMortyResponseDto } from 'src/rickandmorty/dtos/rick-and-morty-response';

describe('RickAndMortyService', () => {
  let service: RickService;
  let rickAndMortyApiAdapter: RickApiAdapter;
  let cacheService: CacheService;

  const mockCharacter: RickAndMortyResponseDto = {
	id: 1,
    name: 'Rick Sanchez',
    image: 'https://example.com/rick.jpg',
    species: 'Human',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RickService,
        {
          provide: RickApiAdapter,
          useValue: {
            getRandomCharacter: jest.fn(),
            searchCharacters: jest.fn(),
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

    service = module.get<RickService>(RickService);
    rickAndMortyApiAdapter = module.get<RickApiAdapter>(RickApiAdapter);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomCharacter', () => {
	it('should return cached character if available', async () => {
	  jest.spyOn(cacheService, 'get').mockResolvedValue(mockCharacter);
  
	  const result = await service.getRandomCharacter();
	  
	  expect(result).toEqual(mockCharacter);
	  expect(cacheService.get).toHaveBeenCalledWith('character:random:any');
	  expect(rickAndMortyApiAdapter.getRandomCharacter).not.toHaveBeenCalled();
	});
  
	it('should fetch and cache a new character if not in cache', async () => {
	  jest.spyOn(cacheService, 'get').mockResolvedValue(null);
	  jest.spyOn(rickAndMortyApiAdapter, 'getRandomCharacter').mockResolvedValue(mockCharacter);
	  jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);
  
	  const result = await service.getRandomCharacter();
	  
	  expect(result).toEqual(mockCharacter);
	  expect(cacheService.get).toHaveBeenCalledWith('character:random:any');
	  expect(rickAndMortyApiAdapter.getRandomCharacter).toHaveBeenCalled();
	  expect(cacheService.set).toHaveBeenCalledWith('character:random:any', mockCharacter, 3600);
	});
  });

});

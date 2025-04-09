import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from 'src/rickandmorty/services/character.service';
import { CharacterAdapter } from 'src/rickandmorty/adapters/character.adapter';
import { CacheService } from '../../../src/shared/cache.service';
import { CharacterResponseDto } from 'src/rickandmorty/dtos/character-response';

describe('RickAndMortyService', () => {
  let service: CharacterService;
  let rickAndMortyApiAdapter: CharacterAdapter;
  let cacheService: CacheService;

  const mockCharacter: CharacterResponseDto = {
	id: 1,
    name: 'Rick Sanchez',
    image: 'https://example.com/rick.jpg',
    species: 'Human',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: CharacterAdapter,
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

    service = module.get<CharacterService>(CharacterService);
    rickAndMortyApiAdapter = module.get<CharacterAdapter>(CharacterAdapter);
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

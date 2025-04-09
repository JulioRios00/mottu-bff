import { Test, TestingModule } from '@nestjs/testing';
import { CatResponseDto } from 'src/cats/dtos/cats-response.dto';
import { CatsService } from 'src/cats/services/cats.service';
import { PairsService } from 'src/pairs/services/pairs.service';
import { CharacterResponseDto } from 'src/rickandmorty/dtos/character-response';
import { CharacterService } from 'src/rickandmorty/services/character.service';


describe('PairsService', () => {
	let service: PairsService;
	let catsService: CatsService;
	let rickAndMortyService: CharacterService;
  
	const mockCat: CatResponseDto = {
	  id: 'test-id',
	  image: 'https://example.com/cat.jpg',
	};
  
	const mockCharacter: CharacterResponseDto = {
	  id: 1,
	  name: 'Rick Sanchez',
	  image: 'https://example.com/rick.jpg',
	  species: 'Human',
	};
  
	beforeEach(async () => {
	  const module: TestingModule = await Test.createTestingModule({
		providers: [
		  PairsService,
		  {
			provide: CatsService,
			useValue: {
			  getRandomCat: jest.fn(),
			},
		  },
		  {
			provide: CharacterService,
			useValue: {
			  getRandomCharacter: jest.fn(),

			},
		  },
		],
	  }).compile();
  
	  service = module.get<PairsService>(PairsService);
	  catsService = module.get<CatsService>(CatsService);
	  rickAndMortyService = module.get<CharacterService>(CharacterService);
	});
  
	it('should be defined', () => {
	  expect(service).toBeDefined();
	});
  
	describe('getRandomPair', () => {
	  it('should return a pair with a random character and cat', async () => {
		jest.spyOn(rickAndMortyService, 'getRandomCharacter').mockResolvedValue(mockCharacter);
		jest.spyOn(catsService, 'getRandomCat').mockResolvedValue(mockCat);
  
		const result = await service.getRandomPair();
		
		expect(result).toEqual({
		  character: mockCharacter,
		  cat: mockCat,
		});
		expect(rickAndMortyService.getRandomCharacter).toHaveBeenCalled();
		expect(catsService.getRandomCat).toHaveBeenCalled();
	  });
	});
});
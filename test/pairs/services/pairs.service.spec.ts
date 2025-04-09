import { Test, TestingModule } from '@nestjs/testing';
import { CatResponseDto } from 'src/cats/dtos/cats-response.dto';
import { CatsService } from 'src/cats/services/cats.service';
import { PairsService } from 'src/pairs/services/pairs.service';
import { RickAndMortyResponseDto } from 'src/rickandmorty/dtos/rick-and-morty-response';
import { RickService } from 'src/rickandmorty/services/rick-and-morty.service';


describe('PairsService', () => {
	let service: PairsService;
	let catsService: CatsService;
	let rickAndMortyService: RickService;
  
	const mockCat: CatResponseDto = {
	  id: 'test-id',
	  image: 'https://example.com/cat.jpg',
	};
  
	const mockCharacter: RickAndMortyResponseDto = {
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
			provide: RickService,
			useValue: {
			  getRandomCharacter: jest.fn(),

			},
		  },
		],
	  }).compile();
  
	  service = module.get<PairsService>(PairsService);
	  catsService = module.get<CatsService>(CatsService);
	  rickAndMortyService = module.get<RickService>(RickService);
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
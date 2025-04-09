import { Injectable } from '@nestjs/common';
import { CatsService } from '../../cats/services/cats.service';
import { CharacterService } from '../../rickandmorty/services/character.service';
import { PairResponseDto } from '../dtos/pairs-response.dto'
import { CharacterResponseDto } from '../../rickandmorty/dtos/character-response';

@Injectable()
export class PairsService {
  constructor(
    private readonly catsService: CatsService,
    private readonly rickAndMortyService: CharacterService,
  ) {}

  async getRandomPair(): Promise<PairResponseDto> {
    const character = await this.rickAndMortyService.getRandomCharacter();
    const cat = await this.catsService.getRandomCat();

    return {
      character,
      cat,
    };
  }

  async searchPairs(characterName?: string, catBreed?: string): Promise<PairResponseDto[]> {
	try {
	  if (!characterName && !catBreed) {
		const randomPair = await this.getRandomPair();
		return [randomPair];
	  }
	  
	  let characters: CharacterResponseDto[] = [];
	  if (characterName) {
		characters = await this.rickAndMortyService.searchCharacters(characterName);
		
		if (!characters || characters.length === 0) {
		  return [];
		}
	  } else {
		const randomCharacter = await this.rickAndMortyService.getRandomCharacter();
		characters = [randomCharacter];
	  }
	  
	  const pairs: PairResponseDto[] = [];
	  
	  for (const character of characters) {
		try {
		  const cat = await this.catsService.getRandomCat(catBreed);
		  pairs.push({
			character,
			cat,
		  });
		} catch (error) {
		  console.error(`Error fetching cat for character ${character.name}:`, error.message);
		  if (catBreed) {
			try {
			  const cat = await this.catsService.getRandomCat();
			  pairs.push({
				character,
				cat,
			  });
			} catch (innerError) {
			  console.error(`Error fetching any cat for character ${character.name}:`, innerError.message);
			}
		  }
		}
	  }
	  
	  return pairs;
	} catch (error) {
	  console.error('Error in searchPairs:', error.message);
	  return [];
	}
  }
}
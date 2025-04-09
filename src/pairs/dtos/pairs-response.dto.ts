import { CharacterResponseDto } from '../../rickandmorty/dtos/character-response';
import { CatResponseDto } from '../../cats/dtos/cats-response.dto';

export class PairResponseDto {
  character: CharacterResponseDto;
  cat: CatResponseDto;
}

export class PairSearchQueryDto {
  characterName?: string;
  catBreed?: string;
}
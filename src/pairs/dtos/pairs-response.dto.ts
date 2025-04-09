import { RickAndMortyResponseDto } from '../../rickandmorty/dtos/rick-and-morty-response';
import { CatResponseDto } from '../../cats/dtos/cats-response.dto';

export class PairResponseDto {
  character: RickAndMortyResponseDto;
  cat: CatResponseDto;
}

export class PairSearchQueryDto {
  characterName?: string;
  catBreed?: string;
}
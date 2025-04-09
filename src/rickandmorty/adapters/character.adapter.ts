import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CharacterResponseDto } from '../dtos/character-response';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CharacterAdapter {
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private readonly httpService: HttpService) {}

  async getRandomCharacter(): Promise<CharacterResponseDto> {
    try {
      const randomId = Math.floor(Math.random() * 826) + 1;
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/character/${randomId}`)
      );
      
      const character = response.data;
      
      return {
        id: character.id,
        name: character.name,
        image: character.image,
        species: character.species,
      };
    } catch (error) {
      throw new NotFoundException('No character data found');
    }
  }

  async searchCharacters(name: string): Promise<CharacterResponseDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/character`, {
          params: { name },
        })
      );
      
      const characters = response.data.results;
      
      return characters.map(character => ({
        id: character.id,
        name: character.name,
        image: character.image,
        species: character.species,
      }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw new NotFoundException('Error searching characters');
    }
  }
}
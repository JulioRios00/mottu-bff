import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RickAndMortyResponseDto } from '../dtos/rick-and-morty-response';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RickApiAdapter {
  private readonly apiUrl = 'https://rickandmortyapi.com/api';
  
  constructor(private readonly httpService: HttpService) {}

  async getRandomCharacter(name?: string): Promise<RickAndMortyResponseDto> {
    const { data: info } = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/character`).pipe(
        map(response => response),
        catchError((error: AxiosError) => {
          throw new Error(`Failed to fetch character info: ${error.message}`);
        }),
      ),
    );

    let characterData;

    if (name) {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/character`, {
          params: { name },
        }).pipe(
          map(response => response),
          catchError((error: AxiosError) => {
            if (error.response?.status === 404) {
              throw new Error(`No character found with name: ${name}`);
            }
            throw new Error(`Failed to fetch character data: ${error.message}`);
          }),
        ),
      );

      if (!data.results || data.results.length === 0) {
        throw new Error(`No character found with name: ${name}`);
      }

      const randomIndex = Math.floor(Math.random() * data.results.length);
      characterData = data.results[randomIndex];
    } else {
      const count = info.info.count;
      const randomId = Math.floor(Math.random() * count) + 1;

      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/character/${randomId}`).pipe(
          map(response => response),
          catchError((error: AxiosError) => {
            throw new Error(`Failed to fetch character data: ${error.message}`);
          }),
        ),
      );

      characterData = data;
    }

    return {
      id: characterData.id,
      name: characterData.name,
      image: characterData.image,
      species: characterData.species,
    };
  }
}
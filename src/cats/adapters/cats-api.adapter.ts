import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CatResponseDto, BreedResponseDto } from '../dtos/cats-response.dto';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class CatApiAdapter {
  private readonly apiUrl = 'https://api.thecatapi.com/v1';
  
  constructor(private readonly httpService: HttpService) {}

  async getRandomCat(breedId?: string): Promise<CatResponseDto> {
    try {
      const params: any = {};
      if (breedId) {
        params.breed_ids = breedId;
      }

      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/images/search`, { params }).pipe(
          map(response => response),
          catchError((error: AxiosError) => {
            throw new HttpException(
              `Failed to fetch cat data: ${error.message}`,
              HttpStatus.SERVICE_UNAVAILABLE
            );
          }),
        ),
      );

      if (!data || data.length === 0) {
        throw new HttpException('No cat data found', HttpStatus.NOT_FOUND);
      }

      return {
        id: data[0].id,
        image: data[0].url,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while fetching cat data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getBreeds(): Promise<BreedResponseDto[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/breeds`).pipe(
          map(response => response),
          catchError((error: AxiosError) => {
            throw new HttpException(
              `Failed to fetch cat breeds: ${error.message}`,
              HttpStatus.SERVICE_UNAVAILABLE
            );
          }),
        ),
      );

      return data.map(breed => ({
        id: breed.id,
        name: breed.name
      }));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while fetching cat breeds',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
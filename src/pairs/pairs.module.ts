import { Module } from '@nestjs/common';
import { PairsController } from './controllers/pairs.controller';
import { PairsService } from './services/pairs.service';
import { CatsModule } from '../cats/cats.module';
import { RickAndMortyModule } from '../rickandmorty/rick-and-morty.module';

@Module({
  imports: [CatsModule, RickAndMortyModule],
  controllers: [PairsController],
  providers: [PairsService],
})
export class PairsModule {}
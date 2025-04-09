import { Module } from '@nestjs/common';
import { PairsController } from './controllers/pairs.controller';
import { PairsService } from './services/pairs.service';
import { CatsModule } from '../cats/cats.module';
import { CharacterModule } from '../rickandmorty/character.module';

@Module({
  imports: [CatsModule, CharacterModule],
  controllers: [PairsController],
  providers: [PairsService],
})
export class PairsModule {}
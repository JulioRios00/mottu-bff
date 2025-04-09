import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CharacterModule } from './rickandmorty/character.module';
import { PairsModule } from './pairs/pairs.module';
import { SharedModule } from './shared/sharedModule.module';

@Module({
  imports: [
    SharedModule,
    CatsModule, 
    CharacterModule, 
    PairsModule
  ],
})
export class AppModule {}
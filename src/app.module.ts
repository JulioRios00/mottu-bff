import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { RickAndMortyModule } from './rickandmorty/rick-and-morty.module';
import { PairsModule } from './pairs/pairs.module';
import { SharedModule } from './shared/sharedModule.module';

@Module({
  imports: [
    SharedModule,
    CatsModule, 
    RickAndMortyModule, 
    PairsModule
  ],
})
export class AppModule {}
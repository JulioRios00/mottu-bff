import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RickController } from './controllers/rick-and-morty.controller';
import { RickService } from './services/rick-and-morty.service';
import { RickApiAdapter } from './adapters/rick-and-morty.adapter';
import { SharedModule } from '../shared/sharedModule.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    SharedModule,
  ],
  controllers: [RickController],
  providers: [RickService, RickApiAdapter],
  exports: [RickService],
})
export class RickAndMortyModule {}
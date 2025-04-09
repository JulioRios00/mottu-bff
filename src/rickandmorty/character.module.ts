import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CharacterController } from './controllers/character.controller';
import { CharacterService } from './services/character.service';
import { CharacterAdapter } from './adapters/character.adapter';
import { SharedModule } from '../shared/sharedModule.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    SharedModule,
  ],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterAdapter],
  exports: [CharacterService],
})
export class CharacterModule {}
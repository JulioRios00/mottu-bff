import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { CatApiAdapter } from './adapters/cats-api.adapter';
import { SharedModule } from '../shared/sharedModule.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    SharedModule,
  ],
  controllers: [CatsController],
  providers: [CatsService, CatApiAdapter],
  exports: [CatsService],
})
export class CatsModule {}
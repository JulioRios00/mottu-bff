import { Module, Global } from '@nestjs/common';
import { CacheService } from '../shared/cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class SharedModule {}
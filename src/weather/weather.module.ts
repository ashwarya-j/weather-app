import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherResolver } from './weather.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300, // Default TTL for caching (5 minutes)
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherResolver, CacheService],
})
export class WeatherModule {}

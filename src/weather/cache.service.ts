import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly DEFAULT_TTL = 300 * 1000; // 5 minutes in milliseconds

  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}

  /**
   * Retrieve cached data by key.
   * If data is not found, fetch fresh data, store it in cache, and return it.
   */
  async get<T>(
    cacheKey: string,
    fetchFunction: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    try {
      // Check if data is already cached
      const cachedData = await this.cacheManager.get<T>(cacheKey);
      if (cachedData) {
        console.log(`[Cache Hit] Returning cached data for key: ${cacheKey}`);

        // Refresh cache asynchronously without blocking the response
        this.set(cacheKey, cachedData, ttl).catch((err) =>
          console.error(`[Cache Refresh Error] ${cacheKey}`, err)
        );

        return cachedData;
      }

      // Cache miss: fetch fresh data and store in cache
      console.log(`[Cache Miss] Fetching fresh data for key: ${cacheKey}`);
      const newData = await fetchFunction();
      await this.set(cacheKey, newData, ttl);
      return newData;
    } catch (error) {
      console.error(
        `[Cache Error] Failed to retrieve data for key: ${cacheKey}`,
        error
      );
      throw error;
    }
  }

  /**
   * Store data in cache with the given TTL.
   */
  async set<T>(
    cacheKey: string,
    data: T,
    ttl: number = this.DEFAULT_TTL
  ): Promise<void> {
    try {
      await this.cacheManager.set(cacheKey, data, ttl);
      console.log(
        `[Cache Set] Stored data for key: ${cacheKey} with TTL: ${ttl / 1000} seconds`
      );
    } catch (error) {
      console.error(
        `[Cache Set Error] Failed to store data for key: ${cacheKey}`,
        error
      );
      throw error;
    }
  }
}

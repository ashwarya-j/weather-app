import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
 * CacheService is responsible for handling caching operations.
 * It provides methods to store data in the cache and retrieve it, using a cache manager.
 * Implements a Stale-While-Revalidate caching strategy for optimizing the fetching of data.
 */
@Injectable()
export class CacheService {
  private readonly DEFAULT_TTL = 300 * 1000; // 5 minutes in milliseconds

  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}

  /**
   * Retrieves data from the cache. If the data is not found, it fetches fresh data, stores it in the cache, and returns it.
   * Implements Stale-While-Revalidate: if cached data is available, it's returned immediately, and fresh data is fetched in the background.
   * @param cacheKey The cache key used to store and retrieve the data.
   * @param fetchFunction A function that fetches fresh data if a cache miss occurs.
   * @param ttl The time-to-live (TTL) for the cache in milliseconds. Defaults to 5 minutes.
   * @returns The cached or freshly fetched data.
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
   * Stores data in the cache with the given TTL.
   * @param cacheKey The cache key used to store the data.
   * @param data The data to be stored in the cache.
   * @param ttl The time-to-live (TTL) for the cache in milliseconds. Defaults to 5 minutes.
   * @returns A promise that resolves when the data is successfully stored in the cache.
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

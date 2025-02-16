import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { WeatherResponse } from './weather.model';
import { WeatherForecastResponse } from './forecast.model';
import { CacheService } from './cache.service';

@Injectable()
export class WeatherService {
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey = process.env.WEATHER_API_KEY;
  private readonly TTL = { WEATHER: 300000, FORECAST: 1800000 }; // TTL in milliseconds

  constructor(private readonly cacheService: CacheService) {}

  async getCurrentWeather(city: string): Promise<WeatherResponse> {
    return this.getCachedData<WeatherResponse>(
      `weather:${city}`,
      'weather',
      city,
      this.TTL.WEATHER
    );
  }

  async getForecast(city: string): Promise<WeatherForecastResponse> {
    return this.getCachedData<WeatherForecastResponse>(
      `forecast:${city}`,
      'forecast',
      city,
      this.TTL.FORECAST
    );
  }

  /**
   * A reusable method for getting cached data or fetching fresh data from API
   */
  private async getCachedData<T>(
    cacheKey: string,
    endpoint: string,
    city: string,
    ttl: number
  ): Promise<T> {
    return this.cacheService.get<T>(
      cacheKey,
      async () =>
        this.fetchFromAPI<T>(
          `${this.apiUrl}/${endpoint}?q=${city}&appid=${this.apiKey}&units=metric`
        ),
      ttl
    );
  }

  /**
   * Fetch data from the external API
   */
  private async fetchFromAPI<T>(url: string): Promise<T> {
    try {
      const { data } = await axios.get<T>(url);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.status === 404
            ? 'City not found. Please check the city name.'
            : 'Weather service is unavailable. Please try again later.',
          axiosError.response.status === 404
            ? HttpStatus.NOT_FOUND
            : HttpStatus.SERVICE_UNAVAILABLE
        );
      }
      throw new HttpException(
        'Failed to fetch data from external API. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

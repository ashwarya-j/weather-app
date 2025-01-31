import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from './weather.service';
import { WeatherResponse } from './weather.model';
import { WeatherForecastResponse } from './forecast.model';

/**
 * WeatherResolver handles GraphQL queries for fetching weather-related data.
 * It interacts with the WeatherService to fetch current weather and weather forecast information for a given city.
 */
@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Fetches current weather data for the specified city.
   * This method will call the WeatherService to get the latest weather data.
   * @param city The name of the city for which to fetch current weather data.
   * @returns The weather data for the city.
   */
  @Query(() => WeatherResponse, { name: 'getCurrentWeather' })
  async getCurrentWeather(
    @Args('city') city: string
  ): Promise<WeatherResponse> {
    return await this.weatherService.getCurrentWeather(city);
  }

  /**
   * Fetches weather forecast data for the specified city.
   * This method will call the WeatherService to get the forecast data.
   * @param city The name of the city for which to fetch weather forecast data.
   * @returns The weather forecast data for the city.
   * @throws Error if there is an issue fetching the forecast data, such as a service failure.
   */
  @Query(() => WeatherForecastResponse, { name: 'getForecast' })
  async getForecast(
    @Args('city') city: string
  ): Promise<WeatherForecastResponse> {
    try {
      return await this.weatherService.getForecast(city);
    } catch (error) {
      console.error(
        `[WeatherResolver Error] Failed to fetch forecast for ${city}:`,
        error
      );
      throw new Error('Unable to fetch weather forecast. Please try again.');
    }
  }
}

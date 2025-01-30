import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from './weather.service';
import { WeatherResponse } from './weather.model';
import { WeatherForecastResponse } from './forecast.model';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Get current weather data for a given city.
   */
  @Query(() => WeatherResponse, { name: 'getCurrentWeather' })
  async getCurrentWeather(
    @Args('city') city: string
  ): Promise<WeatherResponse> {
    return await this.weatherService.getCurrentWeather(city);
  }

  /**
   * Get weather forecast data for a given city.
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

import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherResponse } from './weather.model';
import { WeatherForecastResponse } from './forecast.model';

/**
 * WeatherController handles HTTP requests related to weather data.
 * It exposes endpoints for fetching current weather and weather forecast information for a given city.
 */
@Controller('weather')
export class WeatherController {
  /**
   * Constructor for WeatherController.
   * @param weatherService The service used to fetch weather data from external APIs or cache.
   */
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Fetches the current weather data for the specified city.
   * This method calls the WeatherService to get the current weather information.
   * @param city The name of the city for which to fetch the current weather.
   * @returns The weather data for the specified city.
   */
  @Get(':city')
  async getCurrentWeather(
    @Param('city') city: string
  ): Promise<WeatherResponse> {
    return this.weatherService.getCurrentWeather(city);
  }

  /**
   * Fetches the weather forecast data for the specified city.
   * This method calls the WeatherService to get the weather forecast for the city.
   * @param city The name of the city for which to fetch the weather forecast.
   * @returns The weather forecast data for the specified city.
   */
  @Get('forecast/:city')
  async getWeatherForecast(
    @Param('city') city: string
  ): Promise<WeatherForecastResponse> {
    return this.weatherService.getForecast(city);
  }
}

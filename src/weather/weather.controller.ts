import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherResponse } from './weather.model';
import { WeatherForecastResponse } from './forecast.model';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @Get(':city')
  async getCurrentWeather(
    @Param('city') city: string
  ): Promise<WeatherResponse> {
    return this.weatherService.getCurrentWeather(city);
  }

  @Get('forecast/:city')
  async getWeatherForecast(
    @Param('city') city: string
  ): Promise<WeatherForecastResponse> {
    return this.weatherService.getForecast(city);
  }
}

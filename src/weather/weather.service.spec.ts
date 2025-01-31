/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { CacheService } from './cache.service';
import axios from 'axios';
import { WeatherResponse } from './weather.model';
import { WeatherForecastResponse } from './forecast.model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let service: WeatherService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    const mockWeatherResponse: WeatherResponse = {
      coord: { lon: 139, lat: 35 },
      weather: [
        { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
      ],
      base: 'stations',
      main: {
        temp: 25.5,
        feels_like: 26.2,
        temp_min: 24.8,
        temp_max: 26.3,
        pressure: 1012,
        humidity: 65,
        sea_level: 1012,
        grnd_level: 1008,
      },
      visibility: 10000,
      wind: { speed: 5.5, deg: 180 },
      clouds: { all: 0 },
      dt: 1618317040,
      sys: {
        type: 1,
        id: 8074,
        country: 'JP',
        sunrise: 1618282134,
        sunset: 1618333901,
      },
      timezone: 32400,
      id: 1851632,
      name: 'Tokyo',
      cod: 200,
    };

    it('should fetch weather data from API if not in cache', async () => {
      (cacheService.get as jest.Mock).mockImplementation(
        async (_: string, fetchFn: () => Promise<WeatherResponse>) => fetchFn()
      );
      mockedAxios.get.mockResolvedValueOnce({ data: mockWeatherResponse });

      const result = await service.getCurrentWeather('Tokyo');
      console.log('Result is...', result);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('Tokyo')
      );
      expect(result).toEqual(mockWeatherResponse);
    });
  });

  describe('getForecast', () => {
    const mockForecastResponse: WeatherForecastResponse = {
      cod: '200',
      message: 0,
      cnt: 40,
      list: [
        {
          dt: 1618317040,
          main: {
            temp: 25.5,
            feels_like: 26.2,
            temp_min: 24.8,
            temp_max: 26.3,
            pressure: 1012,
            humidity: 65,
            sea_level: 1012,
            grnd_level: 1008,
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
          clouds: { all: 0 },
          wind: { speed: 5.5, deg: 180 },
          dt_txt: '2021-04-13 00:00:00',
        },
      ],
      city: {
        id: 1851632,
        name: 'Tokyo',
        country: 'JP',
        population: 0,
        timezone: 32400,
        sunrise: 1618282134,
        sunset: 1618333901,
      },
    };

    it('should fetch forecast data from API if not in cache', async () => {
      (cacheService.get as jest.Mock).mockImplementation(
        async (_: string, fetchFn: () => Promise<WeatherForecastResponse>) =>
          fetchFn()
      );
      mockedAxios.get.mockResolvedValueOnce({ data: mockForecastResponse });

      const result = await service.getForecast('Tokyo');
      console.log('Forecast result is...', result);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('Tokyo')
      );
      expect(result).toEqual(mockForecastResponse);
    });
  });
});

import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
class ForecastMain {
  @Field(() => Float)
  temp: number;

  @Field(() => Float)
  feels_like: number;

  @Field(() => Float)
  temp_min: number;

  @Field(() => Float)
  temp_max: number;

  @Field()
  pressure: number;

  @Field()
  humidity: number;

  @Field()
  sea_level: number;

  @Field()
  grnd_level: number;
}

@ObjectType()
class ForecastWeather {
  @Field()
  id: number;

  @Field()
  main: string;

  @Field()
  description: string;

  @Field()
  icon: string;
}

@ObjectType()
class ForecastWind {
  @Field(() => Float)
  speed: number;

  @Field()
  deg: number;
}

@ObjectType()
class ForecastClouds {
  @Field()
  all: number;
}

@ObjectType()
class ForecastItem {
  @Field()
  dt: number;

  @Field(() => ForecastMain)
  main: ForecastMain;

  @Field(() => [ForecastWeather])
  weather: ForecastWeather[];

  @Field(() => ForecastClouds)
  clouds: ForecastClouds;

  @Field(() => ForecastWind)
  wind: ForecastWind;

  @Field()
  dt_txt: string;
}

@ObjectType()
class ForecastCity {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field(() => Float)
  population: number;

  @Field()
  timezone: number;

  @Field()
  sunrise: number;

  @Field()
  sunset: number;
}

@ObjectType()
export class WeatherForecastResponse {
  @Field()
  cod: string;

  @Field()
  message: number;

  @Field()
  cnt: number;

  @Field(() => [ForecastItem])
  list: ForecastItem[];

  @Field(() => ForecastCity)
  city: ForecastCity;
}

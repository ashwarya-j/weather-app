import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
class WeatherCoord {
  @Field()
  lon: number;

  @Field()
  lat: number;
}

@ObjectType()
class WeatherDescription {
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
class WeatherMain {
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
class WeatherWind {
  @Field(() => Float)
  speed: number;

  @Field()
  deg: number;
}

@ObjectType()
class WeatherSys {
  @Field()
  type: number;

  @Field()
  id: number;

  @Field()
  country: string;

  @Field()
  sunrise: number;

  @Field()
  sunset: number;
}

@ObjectType()
class WeatherClouds {
  @Field()
  all: number;
}

@ObjectType()
export class WeatherResponse {
  @Field(() => WeatherCoord)
  coord: WeatherCoord;

  @Field(() => [WeatherDescription])
  weather: WeatherDescription[];

  @Field()
  base: string;

  @Field(() => WeatherMain)
  main: WeatherMain;

  @Field()
  visibility: number;

  @Field(() => WeatherWind)
  wind: WeatherWind;

  @Field(() => WeatherClouds)
  clouds: WeatherClouds;

  @Field()
  dt: number;

  @Field(() => WeatherSys)
  sys: WeatherSys;

  @Field()
  timezone: number;

  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  cod: number;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './locations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationsService],
  controllers: [LocationsController],
})
export class LocationsModule {}

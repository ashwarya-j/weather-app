import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './locations.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>
  ) {}

  async addLocation(city: string, country?: string): Promise<Location> {
    const location = this.locationRepository.create({ city, country });
    if (!city || typeof city !== 'string' || city.trim() === '') {
      throw new BadRequestException('City name must be a non-empty string.');
    }
    return this.locationRepository.save(location);
  }

  async getLocations(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async removeLocation(id: number): Promise<void> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found.`);
    }
    await this.locationRepository.delete(id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './locations.entity';

/**
 * LocationsService handles the business logic for managing locations.
 * It allows adding, retrieving, and removing locations from the database.
 */
@Injectable()
export class LocationsService {
  /**
   * Constructor for LocationsService.
   * @param locationRepository The repository used to interact with the Location entity in the database.
   */
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>
  ) {}

  /**
   * Adds a new location to the database.
   * Validates that the city name is a non-empty string before adding it to the database.
   * @param city The name of the city to be added.
   * @param country The country where the city is located. Optional.
   * @returns The created Location entity.
   * @throws BadRequestException if the city name is not a valid non-empty string.
   */
  async addLocation(city: string, country?: string): Promise<Location> {
    const location = this.locationRepository.create({ city, country });
    if (!city || typeof city !== 'string' || city.trim() === '') {
      throw new BadRequestException('City name must be a non-empty string.');
    }
    return this.locationRepository.save(location);
  }

  /**
   * Retrieves all locations from the database.
   * @returns An array of all Location entities.
   */
  async getLocations(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  /**
   * Removes a location from the database by its ID.
   * If the location does not exist, it throws a NotFoundException.
   * @param id The ID of the location to be removed.
   * @returns A promise that resolves when the location is deleted.
   * @throws NotFoundException if the location with the specified ID is not found.
   */
  async removeLocation(id: number): Promise<void> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found.`);
    }
    await this.locationRepository.delete(id);
  }
}

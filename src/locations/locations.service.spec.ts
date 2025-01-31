import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { Location } from './locations.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LocationsService', () => {
  let service: LocationsService;

  const mockLocationRepository = {
    create: jest.fn().mockImplementation((city: string, country?: string) => ({
      city,
      country,
    })),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addLocation', () => {
    it('should successfully add a location with valid data', async () => {
      const city = 'Paris';
      const country = 'France';

      const mockLocation = { city, country };

      mockLocationRepository.create.mockReturnValue(mockLocation);
      mockLocationRepository.save.mockResolvedValue(mockLocation);

      const result = await service.addLocation(city, country);

      expect(mockLocationRepository.create).toHaveBeenCalledWith({
        city,
        country,
      });

      expect(mockLocationRepository.save).toHaveBeenCalledWith(mockLocation);

      expect(result).toEqual(mockLocation);
    });

    it('should throw BadRequestException for an empty city', async () => {
      const city = '';
      const country = 'France';

      await expect(service.addLocation(city, country)).rejects.toThrowError(
        new BadRequestException('City name must be a non-empty string.')
      );
    });

    it('should throw BadRequestException for a non-string city', async () => {
      const city = 123 as unknown as string; // Casting to simulate an invalid value
      const country = 'France';

      await expect(service.addLocation(city, country)).rejects.toThrowError(
        new BadRequestException('City name must be a non-empty string.')
      );
    });
  });

  describe('getLocations', () => {
    it('should return an array of locations', async () => {
      const mockLocations = [
        { city: 'Paris', country: 'France' },
        { city: 'London', country: 'UK' },
      ];

      mockLocationRepository.find.mockResolvedValue(mockLocations);

      const result = await service.getLocations();

      expect(mockLocationRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockLocations);
    });
  });

  describe('removeLocation', () => {
    it('should successfully remove a location when it exists', async () => {
      const locationId = 1;
      const mockLocation = { id: locationId, city: 'Paris', country: 'France' };

      mockLocationRepository.findOne.mockResolvedValue(mockLocation);
      mockLocationRepository.delete.mockResolvedValue(undefined);

      await service.removeLocation(locationId);

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id: locationId },
      });
      expect(mockLocationRepository.delete).toHaveBeenCalledWith(locationId);
    });

    it('should throw NotFoundException when location does not exist', async () => {
      const locationId = -1;

      mockLocationRepository.findOne.mockResolvedValue(null);

      await expect(service.removeLocation(locationId)).rejects.toThrow(
        new NotFoundException(`Location with id ${locationId} not found.`)
      );
    });
  });
});

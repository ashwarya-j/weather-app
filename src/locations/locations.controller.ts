import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async addLocation(@Body() body: { city: string; country?: string }) {
    return this.locationsService.addLocation(body.city, body.country);
  }

  @Get()
  async getLocations() {
    return this.locationsService.getLocations();
  }

  @Delete(':id')
  async removeLocation(@Param('id') id: string) {
    await this.locationsService.removeLocation(parseInt(id, 10));
    return { message: 'Location removed' };
  }
}

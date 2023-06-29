import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto, UpdateParkingDto } from './dto/parking.dto';

@Controller('parking')
export class ParkingController {
  constructor(
    private readonly parkingService: ParkingService
  ){}

  @Post()
  async createParking(@Body() payload: CreateParkingDto) {
    try {
      
    } catch (error) {
      
    }
    return this.parkingService.createParking(payload);
  }

  @Get()
  async findAll() {
    return this.parkingService.findAll();
  }

  @Get()
  async findById(
    @Query('id') id: string
  ) {
    return this.parkingService.findById(id);
  }

  @Patch()
  async updateParking(
    @Param('id') id: string,
    @Body() payload: UpdateParkingDto,
  ) {
    try {
      
    } catch (error) {
      
    }

    return this.parkingService.updateParking(id, payload);
  }
}

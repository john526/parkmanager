import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Parking]),
    HelperModule
  ],
  providers: [ParkingService],
  controllers: [ParkingController],
  exports:[ParkingService]
})
export class ParkingModule {}

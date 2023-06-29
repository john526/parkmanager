import { Module } from '@nestjs/common';
import { ParkingPlaceService } from './parking-place.service';
import { ParkingPlaceController } from './parking-place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingPlace } from './entities/parking-place.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([ParkingPlace]),
    HelperModule
  ],
  providers: [ParkingPlaceService],
  controllers: [ParkingPlaceController],
  exports:[ParkingPlaceService]
})
export class ParkingPlaceModule {}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ParkingPlace } from './entities/parking-place.entity';
import { HelperService } from '../helper/helper.service';
import { CreateParkingPlaceDto, UpdateParkingPlaceDto } from './dto/parking-place.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParkingPlaceService {

  constructor(
    @InjectRepository(ParkingPlace)
    private readonly repository: Repository<ParkingPlace>,
    private readonly helperService: HelperService
  ){}

  async createParkingPlace(dto: CreateParkingPlaceDto) {
    const parkingPlace = new ParkingPlace();

    parkingPlace.id = this.helperService.generateShortId('parkP');
    parkingPlace.enable = dto.enable;
    parkingPlace.parking = dto.parking;
    parkingPlace.parkingPlaceIsEnable = parkingPlace.parkingPlaceIsEnable;
    parkingPlace.timeOfOccupation = parkingPlace.timeOfOccupation;
  }

  async findAll():  Promise<ParkingPlace[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<ParkingPlace> {
    if(!id) return null;

    return this.repository.findOne({
      where:{
        id
      }
    });
  }

  async updateParkingPlace(id: string, updateParkingPlace: UpdateParkingPlaceDto) {
    if(!id)return null;

    return this.repository.update(id, updateParkingPlace);
  }

  async deleteParking(id: string) {
    if(!id) return null;

    return this.repository.delete(id);
  }
}

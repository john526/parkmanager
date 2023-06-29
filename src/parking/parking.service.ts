import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Parking } from './entities/parking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from '../helper/helper.service';
import { CreateParkingDto, UpdateParkingDto } from './dto/parking.dto';

@Injectable()
export class ParkingService {

  constructor(
    @InjectRepository(Parking)
    private readonly repository: Repository<Parking>,
    private readonly helperService: HelperService
  ){}

  async createParking(dto: CreateParkingDto) {
    const parking = new Parking();

    parking.id = this.helperService.generateShortId('park');
    parking.parkingIsFull = false;
    parking.parkingOccupation = dto.parkingOccupation;
    parking.parkingNumber = dto.parkingNumber;
    parking.parkingPlace = dto.parkingPlace;

    return this.repository.save(parking);
  }

  async findAll(): Promise<Parking[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Parking> {
    return this.repository.findOne({
      where:{
        id
      },
      relations:['parking-place']
    })
  }

  async updateParking(id:string, updateParking: UpdateParkingDto) {

    if(!id) return null;

    return this.repository.update(id, updateParking);
  }

  async deleteParking(id: string) {
    if(!id) return null;

    return this.repository.delete(id);
  }
}

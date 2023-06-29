import { Test, TestingModule } from '@nestjs/testing';
import { ParkingPlaceService } from './parking-place.service';

describe('ParkingPlaceService', () => {
  let service: ParkingPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingPlaceService],
    }).compile();

    service = module.get<ParkingPlaceService>(ParkingPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

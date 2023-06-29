import { Test, TestingModule } from '@nestjs/testing';
import { ParkingPlaceController } from './parking-place.controller';

describe('ParkingPlaceController', () => {
  let controller: ParkingPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingPlaceController],
    }).compile();

    controller = module.get<ParkingPlaceController>(ParkingPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

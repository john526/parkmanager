import { ParkingPlace } from "../entities/parking-place.entity";

type CreateParkingPlacePartial = Omit<
  ParkingPlace,
  |'id'
>;

export type CreateParkingPlaceDto = CreateParkingPlacePartial;

type UpdateParkdingPlacePartial = Omit<
   ParkingPlace,
   |''
>;

export type UpdateParkingPlaceDto = UpdateParkdingPlacePartial;
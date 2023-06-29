import { Parking } from "../entities/parking.entity";

type CreateParkingPartial = Omit<
  Parking,
  |'id'
>;

export type CreateParkingDto = CreateParkingPartial;

type UpdateParkingPartial = Omit<
  Parking,
  |''
>;

export type UpdateParkingDto = UpdateParkingPartial;
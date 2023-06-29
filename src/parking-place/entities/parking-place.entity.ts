import { Parking } from "../../parking/entities/parking.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'parking-place'
})
export class ParkingPlace {
  @PrimaryColumn()
  id: string;

  @Column()
  enable: string;

  @Column()
  parkingPlaceIsEnable: boolean;

  @Column()
  timeOfOccupation: Date;

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @ManyToOne((type)=> Parking, (parking)=> parking.id)
  parking: Parking;
  /* eslint-disable  @typescript-eslint/no-unused-vars */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
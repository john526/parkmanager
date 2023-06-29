import { ParkingPlace } from "../../parking-place/entities/parking-place.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'parking'
})
export class Parking {
  @PrimaryColumn()
  id: string;

  @Column({type:'numeric'})
  parkingNumber: number;

  @Column()
  parkingOccupation: string // Full | half | free

  @Column()
  parkingIsFull: boolean;

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @OneToMany((type)=> ParkingPlace, (parkingPlace)=> parkingPlace.parking)
  parkingPlace: ParkingPlace[];
  /* eslint-disable  @typescript-eslint/no-unused-vars */

  // geoLocalisation

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'entreprise'
})
export class Entreprise {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  space: string;

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @OneToMany((type)=> User, (user)=> user.id, {nullable: true})
  user: User[];
  /* eslint-disable  @typescript-eslint/no-unused-vars */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
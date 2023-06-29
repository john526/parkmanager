import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Authentication } from "../../auth/entities/authentication.entity";
import { Entreprise } from "../../entreprise/entities/entreprise.entity";


@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn()
  id: string;

  // name : string
  @Column()
  name: string;

  // username : string
  @Column({
    unique: true,
  })
  username: string;

  // password : string
  @Column()
  password: string;

  // email : string
  @Column({
    unique: true,
  })
  email: string;

  // createDate : Date
  @CreateDateColumn()
  createDate: Date;

  // authentication relation
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @OneToOne((type) => Authentication, (authentication) => authentication.user, {
    nullable: true,
  })
  authentication: Authentication;
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  @ManyToOne((type)=> Entreprise, (entreprise)=> entreprise.id, {nullable: true})
  entreprise: Entreprise;

  @Column()
  role: string // Admin syst | Admin Entre | Employement | user

}
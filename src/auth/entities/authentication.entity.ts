import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { User } from '../../users/entities/user.entity';


@Entity({
  name: 'authentications',
})
export class Authentication {
  @PrimaryColumn()
  id: string;

  // user relation
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @OneToOne((type) => User, (user) => user.authentication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  // app relation
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @ManyToOne((type) => Application, {
    onDelete: 'CASCADE',
  })
  application: Application;
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  // token : string
  @Column({
    unique: true,
  })
  token: string;

  // // token : string
  // @Column({
  //   unique: true,
  // })
  // otp: string;

  // expiration date : date
  @Column()
  expirationDate: Date;

  // // secondAuthRequired : boolean
  // @Column({
  //   default: true,
  // })
  // secondAuthRequired: boolean;
}

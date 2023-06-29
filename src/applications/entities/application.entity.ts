import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Authentication } from '../../auth/entities/authentication.entity';


@Entity({
  name: 'applications',
})
export class Application {
  @PrimaryColumn()
  id: string;

  // token : string
  @Column({
    unique: true,
  })
  token: string;

  // name : string
  @Column()
  name: string;

  // description : string
  @Column()
  description: string;

  // authentications relation
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  @OneToMany(
    (type) => Authentication,
    (authentication) => authentication.application,
    {
      cascade: true,
    },
  )
  authentications: Authentication[];
  /* eslint-enable  @typescript-eslint/no-unused-vars */
}

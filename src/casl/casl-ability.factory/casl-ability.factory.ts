import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Entreprise } from '../../entreprise/entities/entreprise.entity';
import { User } from '../../users/entities/user.entity';
import { Action } from '../action/user-action.enum';
import { Role } from '../roles/user-role.enum';
import { Parking } from '../../parking/entities/parking.entity';
import { ParkingPlace } from '../../parking-place/entities/parking-place.entity';

type Subjects = InferSubjects<typeof Entreprise | typeof User> | 'all';
type SubjectsParking = InferSubjects<typeof Parking | typeof User> | 'all';
type SubjectsParkingPlace = InferSubjects<typeof ParkingPlace | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;
export type AppAbilityParking = Ability<[Action, SubjectsParking]>;
export type AppAbilityParkingPlace = Ability<[Action, SubjectsParkingPlace]>;

@Injectable()
export class CaslAbilityFactory {
  createForEntreprise(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === Role.AdminSys) {
      can(Action.Manage, 'all'); // read-write access to everything
      cannot(Action.Update, Entreprise);
    } 
    if(user.role === Role.Admin) {
      can(Action.Read, 'all'); // read-only access to everything
      can(Action.Update, Entreprise);
    }
    if(user.role === Role.User) {
      cannot(Action.Manage, 'all');
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  createForUser(user: User) {
    
  }

  createForParking(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, SubjectsParking]>
    >(Ability as AbilityClass<AppAbilityParking>);

    if (user.role === Role.AdminSys) {
      cannot(Action.Manage, 'all'); // read-write access to everything
    } 
    if(user.role === Role.Admin) {
      can(Action.Manage, 'all');
    }
    if(user.role === Role.User) {
      can(Action.Read, 'all');
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<SubjectsParking>,
    });
  }

  createForParkingPlace(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
    Ability<[Action, SubjectsParkingPlace]>
  >(Ability as AbilityClass<AppAbilityParkingPlace>);

  if (user.role === Role.AdminSys) {
    cannot(Action.Manage, 'all'); // read-write access to everything
  } 
  if(user.role === Role.Admin) {
    can(Action.Manage, 'all');
  }
  if(user.role === Role.User) {
    can(Action.Read, 'all');
    can(Action.Update, ParkingPlace);
  }
  return build({
    detectSubjectType: (item) =>
      item.constructor as ExtractSubjectType<SubjectsParkingPlace>,
  });
  }

}
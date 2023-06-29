import { AppAbility, AppAbilityParking, AppAbilityParkingPlace } from "../../casl/casl-ability.factory/casl-ability.factory";


export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;




interface IPolicyHandlerParking {
  handle(abilityParking: AppAbilityParking): boolean;
}

type PolicyHandlerParkingCallback = (abilityParking: AppAbilityParking) => boolean;

export type PolicyHandlerParking = IPolicyHandlerParking | PolicyHandlerParkingCallback;




interface IPolicyHandlerParkingPlace {
  handle(abilityParkingPlace: AppAbilityParkingPlace): boolean;
}

type PolicyHandlerParkingPlaceCallback = (abilityParkingPlace: AppAbilityParkingPlace) => boolean;

export type PolicyHandlerParkingPlace = IPolicyHandlerParkingPlace | PolicyHandlerParkingPlaceCallback;
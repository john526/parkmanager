import { SetMetadata } from "@nestjs/common";
import { PolicyHandler, PolicyHandlerParking, PolicyHandlerParkingPlace } from "./i-policy-handler.interface";

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);



  export const CheckPoliciesParking = (...handlers: PolicyHandlerParking[]) =>
    SetMetadata(CHECK_POLICIES_KEY, handlers);
  
    
    
    export const CheckPoliciesParkingPlace = (...handlers: PolicyHandlerParkingPlace[]) =>
      SetMetadata(CHECK_POLICIES_KEY, handlers);  
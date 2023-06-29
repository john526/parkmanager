import { Entreprise } from "../../entreprise/entities/entreprise.entity";
import { Action } from "../../casl/action/user-action.enum";
import { AppAbility } from "../../casl/casl-ability.factory/casl-ability.factory";
import { IPolicyHandler } from "../interface/i-policy-handler.interface";

export class EntreprisePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Entreprise);
  }
}
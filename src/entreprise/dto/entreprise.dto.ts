import { Entreprise } from "../entities/entreprise.entity";

type CreateEntreprisePartial = Omit<
  Entreprise,
  |'id'
>;

export type CreateEntrepriseDto = CreateEntreprisePartial;

type UpdateEntreprisePartial = Omit<
  Entreprise,
  |'name'
>;

export type UpdateEntrepiseDto = UpdateEntreprisePartial;
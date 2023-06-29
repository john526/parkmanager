
import { Application } from "../../applications/entities/application.entity";
import { UserInfos } from "../../users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { Authentication } from "../entities/authentication.entity";


export class CreateAuthenticationDto {
  user: User;
  application: Application;
}

export interface AuthenticationResponseDto {
  id: string;
  token: string;
  user: UserInfos;
}

export interface CredentialsDto {
  auth: Authentication;
  response: AuthenticationResponseDto;
}
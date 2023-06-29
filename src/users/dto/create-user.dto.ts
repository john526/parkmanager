import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';


type CreateUserPartial = Omit<
  User,
  | 'id'
  | 'createDate'
  | 'authentication'
>;

export type CreateUserDto = CreateUserPartial;

type UpdateUserPartial = Omit<
  User,
  | 'id'
  | 'username'
  | 'password'
  | 'createDate'
  | 'authentication'
>;

export type UpdateUserDto = Partial<UpdateUserPartial>;

export type UserPartial = Omit<
  User,
  | 'password'
  | 'authentication'
>;

export type UserInfos = UserPartial;

export class PostUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class PatchUserDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}


export interface HiddenUser {
  username: string;
  apiKey: string;
}
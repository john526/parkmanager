import { IsNotEmpty, IsString } from 'class-validator';


export class CreateAppDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  token?: string;

  @IsString()
  description?: string;
}

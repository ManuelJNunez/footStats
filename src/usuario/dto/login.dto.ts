import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly nickname: string;

  @IsNotEmpty()
  readonly password: string;
}

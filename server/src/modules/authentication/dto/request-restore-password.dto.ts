import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestRestorePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

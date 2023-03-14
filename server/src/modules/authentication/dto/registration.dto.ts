import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ErrorMessageForAuthorization } from '../enum/errorMessageForAuthorization.enum';
import { RegexpMatchForAuthorization } from '../regexpMatchForAuthorization.class';

export class RegistrationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(24)
  @Matches(RegexpMatchForAuthorization.ONLY_LETTERS_DASHES_SPACES, {
    message: ErrorMessageForAuthorization.FIRST_NAME,
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(24)
  @Matches(RegexpMatchForAuthorization.ONLY_LETTERS_DASHES_SPACES, {
    message: ErrorMessageForAuthorization.LAST_NAME,
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(28)
  @Matches(RegexpMatchForAuthorization.PASSWORD_PATTERN, {
    message: ErrorMessageForAuthorization.PASSWORD,
  })
  password: string;
}

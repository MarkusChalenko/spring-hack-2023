import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ErrorMessageForAuthorization } from '../enum/errorMessageForAuthorization.enum';
import { RegexpMatchForAuthorization } from '../regexpMatchForAuthorization.class';

export class RestorePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(28)
  @Matches(RegexpMatchForAuthorization.PASSWORD_PATTERN, {
    message: ErrorMessageForAuthorization.PASSWORD,
  })
  password: string;
}

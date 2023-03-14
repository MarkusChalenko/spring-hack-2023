import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/modules/user/user.service';
import { TokenPayload } from '../tokenPayload.interface';

@Injectable()
export class JwtRestorPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-restore-password-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.RestorePassword;
        },
      ]),
      secretOrKey: configService.get('JWT_RESTORE_PASSWORD_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const restorePasswordToken = request.cookies?.RestorePassword;
    return this.userService.getUserIfRestorePasswordTokenMatches(
      restorePasswordToken,
      payload.userId,
    );
  }
}

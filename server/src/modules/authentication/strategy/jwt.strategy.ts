import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { TokenPayload } from '../tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const accesToken = request.cookies?.Authentication;

    try {
      await this.jwtService.verifyAsync(accesToken);
    } catch (error) {
      throw new ForbiddenException();
    }

    return this.userService.getById(payload.userId);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compareSync(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async restorePassword(user: User, password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPasswrods = await bcrypt.hashSync(password, salt);
    return await this.userService.changePassword(user.id, hashedPasswrods);
  }

  public getCookieWithJwtAccessToken(userId: number, clientURL?: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN_ACCESS')}`,
    });
    return `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN_ACCESS',
    )}; ${
      clientURL === this.configService.get('FRONTEND_URL_HTTPS')
        ? 'SameSite=None; Secure'
        : ''
    }`;
  }

  public getCookieWithJwtRefreshToken(userId: number, clientURL?: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN_REFRESH')}`,
    });
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN_REFRESH',
    )}; ${
      clientURL === this.configService.get('FRONTEND_URL_HTTPS')
        ? 'SameSite=None; Secure'
        : ''
    }`;
    return {
      cookie,
      token,
    };
  }

  public async getCookieWithJwtRestorePasswordToken(id: number) {
    const payload: TokenPayload = { userId: id };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESTORE_PASSWORD_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN_RESTORE_PASSWORD')}`,
    });

    const cookie = `RestorePassword=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN_RESTORE_PASSWORD',
    )}`;

    return {
      cookie,
      token,
    };
  }

  public getCookieForLogOut() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }

  public getRestorePasswordCookieClear() {
    return [`RestorePassword=; HttpOnly; Path=/; Max-Age=0`];
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return this.userService.getById(payload.userId);
    }
  }
}

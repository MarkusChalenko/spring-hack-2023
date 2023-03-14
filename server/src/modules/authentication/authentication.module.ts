import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtRestorPasswordStrategy } from './strategy/jwt-restore-password.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
//import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRES_IN_ACCESS')}`,
        },
      }),
    }),
    UserModule,
  ],
  providers: [
    AuthenticationService,
    //LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtRestorPasswordStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

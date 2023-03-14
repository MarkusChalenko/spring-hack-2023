import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from './dto/registration.dto';
import { RequestRestorePasswordDto } from './dto/request-restore-password.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard';
import JwtRefreshGuard from './guard/jwt-refresh.guard';
import JwtRestorePasswordGuard from './guard/jwt-restore-password.guard';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('registration')
  async registeration(@Body() registrationData: RegistrationDto) {
    const user = await this.userService.createUser({
      ...registrationData,
    });

    return await this.userService.getById(user.id);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Post('restore-password-request')
  async requestRestorePassword(
    @Body() requestRestorePassword: RequestRestorePasswordDto,
    @Req() request: RequestWithUser,
  ) {
    const { email } = requestRestorePassword;
    const user = await this.userService.getByEmail(email);
    const { cookie: resetPasswordTokenCookie, token: resetPasswordToken } =
      await this.authenticationService.getCookieWithJwtRestorePasswordToken(
        user.id,
      );

    await this.userService.setCurrentRestorePasswordToken(
      resetPasswordToken,
      user.id,
    );

    request.res.setHeader('Set-Cookie', resetPasswordTokenCookie);
  }

  @UseGuards(JwtRestorePasswordGuard)
  @Post('restore-password')
  async restorePassword(
    @Req() request: RequestWithUser,
    @Body() restorePassword: RestorePasswordDto,
  ) {
    const { user } = request;
    await this.authenticationService.restorePassword(
      user,
      restorePassword.password,
    );
    await this.userService.removeRestorePasswordToken(user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getRestorePasswordCookieClear(),
    );
  }
}

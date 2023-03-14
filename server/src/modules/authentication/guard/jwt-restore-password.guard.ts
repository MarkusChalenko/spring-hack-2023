import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtRestorePasswordGuard extends AuthGuard(
  'jwt-restore-password-token',
) {}

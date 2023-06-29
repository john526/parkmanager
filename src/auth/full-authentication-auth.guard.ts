import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FULL_AUTH_STRATEGY_KEY } from './full-authentication.strategy';


@Injectable()
export class FullAuthenticationGuard extends AuthGuard(
  FULL_AUTH_STRATEGY_KEY,
) {}

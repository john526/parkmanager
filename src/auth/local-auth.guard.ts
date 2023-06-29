import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_AUTH_STRATEGY_KEY } from './local.strategy';


@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_AUTH_STRATEGY_KEY) {}

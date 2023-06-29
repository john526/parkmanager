import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HEADER_APP_STRATEGY_KEY } from './header-app-key.strategy';


@Injectable()
export class AppKeyGuard extends AuthGuard(HEADER_APP_STRATEGY_KEY) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as boolean;
  }
}


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ApplicationsService } from './applications.service';


export const HEADER_APP_KEY = 'appkey';
export const HEADER_APP_STRATEGY_KEY = 'header_app_key_strategy';

@Injectable()
export class AppKeyStrategy extends PassportStrategy(
  Strategy,
  HEADER_APP_STRATEGY_KEY,
) {
  constructor(private readonly applicationService: ApplicationsService) {
    super(
      {
        header: HEADER_APP_KEY,
        prefix: '',
      },
      true, // passReqToCallback

      async (appKey, done) => {
        // done: (err: Error | null, user?: Object, info?: Object) => void
        const app = await applicationService.validateApplication(appKey);
        if (app === null) {
          return done(new UnauthorizedException());
        }

        return done(null, app);
      },
    );
  }
}

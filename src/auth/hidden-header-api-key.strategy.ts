import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthService } from './auth.service';


export const HIDDEN_HEADER_API_KEY_STRATEGY = 'hiddenheaderapikeystrategy';


@Injectable()
export class HiddenHeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  HIDDEN_HEADER_API_KEY_STRATEGY,
) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        header: 'HiddenApiKey',
        prefix: '',
      },
      true, // passReqToCallback

      async (apiKey, verified) => {
        // verified: (err: Error | null, user?: Object, info?: Object) => void
        const user = await authService.validateHiddenUser(apiKey);

        if (user === null) {
          return verified(new UnauthorizedException());
        }

        return verified(null, user);
      },
    );
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';


export const LOCAL_AUTH_STRATEGY_KEY = 'LOCAL_AUTH_STRATEGY_KEY';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LOCAL_AUTH_STRATEGY_KEY,
) {
  constructor(private readonly authenticationService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authenticationService.validateUser(
      username,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

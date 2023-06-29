import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserJWTPayload } from '../users/dto/user-jwt-payload.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';


const HEADER_AUTHENTICATION_TOKEN_KEY = 'authenticationtoken';
export const FULL_AUTH_STRATEGY_KEY = 'FULL_AUTH_STRATEGY_KEY';

@Injectable()
export class FullAuthenticationStrategy extends PassportStrategy(
  Strategy,
  FULL_AUTH_STRATEGY_KEY,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(HEADER_AUTHENTICATION_TOKEN_KEY),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([req => {
    //     let token = null;
    //     if (req && req.cookies) token = req.cookies['jwt'];
    //     return token;
    //   }]), // A changer si on souhaite utiliser plutôt un header spécifique
    //   ignoreExpiration: false, // Définir à true si on ne souhaite faire expirer le token
    //   secretOrKey: configService.get<string>("JWT_SECRET"),
    // })
  }

  async validate(payload: UserJWTPayload): Promise<User> {
    console.log(payload);

    const auth = await this.authService.findOneById(payload.authId);

    if (!auth) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.id !== auth.user.id) {
      throw new UnauthorizedException();
    }

    // We could provide the app here
    return user;
  }
}

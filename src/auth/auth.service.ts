import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UserJWTAcessToken } from '../users/dto/user-jwt-access-token.dto';
import { UserJWTPayload } from '../users/dto/user-jwt-payload.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HelperService } from '../helper/helper.service';
import { Authentication } from './entities/authentication.entity';
import { CreateAuthenticationDto } from './dto/create-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authentication)
    private readonly repository: Repository<Authentication>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
  ) { }

  async validateHiddenUser(apiKey: string): Promise<User | null> {
    const user = await this.usersService.findHiddenOneByApiKey(apiKey);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    }
    return null;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    // 0. On doit disposer des 2 valeurs avant de poursuivre
    if (isEmpty(username) || isEmpty(password)) {
      return null;
    }

    // 1. On essaie de retrouver un utilisateur avec ce username
    const user = await this.usersService.findOneByUsernameOrEmail(username);

    // Si pas d'utilisateur on retourne null
    if (!user) {
      return null;
    }

    // 2. On vérifie que le mot de passe fourni est le bon
    const passwordMatches = await this.helperService.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatches) {
      return null;
    }

    // 3. On retourne l'utilisateur si les conditions sont remplies.
    return user;
  }

  async validateUserWithId(id: string, password: string): Promise<User | null> {
    // 0. On doit disposer des 2 valeurs avant de poursuivre
    if (isEmpty(id) || isEmpty(password)) {
      return null;
    }

    // 1. On essaie de retrouver un utilisateur avec cet
    const user = await this.usersService.findOneById(id);

    // Si pas d'utilisateur on retourne null
    if (!user) {
      return null;
    }

    // 2. On vérifie que le mot de passe fourni est le bon
    const passwordMatches = await this.helperService.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatches) {
      return null;
    }

    // 3. On retourne l'utilisateur si les conditions sont remplies.
    return user;
  }

  getAccessToken(user: User, authId: string): UserJWTAcessToken {
    const payload: UserJWTPayload = {
      username: user.username,
      sub: user.id,
      authId,
    };
    return {
      username: user.username,
      token: this.jwtService.sign(payload),
    };
  }

  async createAndSave(
    queryRunner: QueryRunner,
    auth: CreateAuthenticationDto,
  ): Promise<Authentication> {
    const anAuthentication = new Authentication();

    anAuthentication.id = this.helperService.generateShortId('auth');
    anAuthentication.user = auth.user;
    anAuthentication.application = auth.application;
    const accessToken = this.getAccessToken(auth.user, anAuthentication.id);
    anAuthentication.token = accessToken.token;
    anAuthentication.expirationDate = this.helperService.getExpirationDate();

    return queryRunner.manager.save(anAuthentication);
  }

  async deleteCurrentAuth(queryRunner: QueryRunner, user: User) {
    const result = queryRunner.manager.delete(Authentication, {
      user: user,
    });

    return result;
  }

  async findOneById(id: string): Promise<Authentication> {
    if (!id) return null;

    return this.repository.findOne({
      where: {
        id
      },
      relations:['user']
    });
  }
}

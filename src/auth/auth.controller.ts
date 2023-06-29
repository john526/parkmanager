import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '../users/entities/user.entity';
import { ReqUser } from '../users/decorators/user.decorator';
import { AuthService } from './auth.service';
import { ApplicationsService } from '../applications/applications.service';
import { ReqAppKey } from '../applications/decorators/application.decorator';
import { Authentication } from './entities/authentication.entity';
import { UsersService } from '../users/users.service';
import { Application } from '../applications/entities/application.entity';
import { FullAuthenticationGuard } from './full-authentication-auth.guard';
import { AuthenticationResponseDto, CredentialsDto } from './dto/create-auth.dto';
import { AppKeyGuard } from '../applications/app-key.guard';


@UseGuards(AppKeyGuard)
@Controller('authentications')
export class AuthenticationsController {
  constructor(
    private readonly authService: AuthService,
    private readonly applicationsService: ApplicationsService,
    private readonly connection: Connection,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post()
  @HttpCode(200)
  async firstFactorAuthentication(
    @ReqUser() user: User,
    @ReqAppKey() appKey: string,
  ): Promise<AuthenticationResponseDto> {
    console.log(user);

    // 1. We need to retrieve the concerned application
    const application = await this.applicationsService.findOneByToken(appKey);

    if (!application) {
      throw new UnauthorizedException();
    }

    const credentials = await this.getCredentials(user, application);

    return credentials.response;
  }

  // Logout
  @UseGuards(FullAuthenticationGuard)
  @Delete(':id')
  @HttpCode(200)
  async logout(@Param('id') id: string, @ReqUser() user: User) {
    // 1. We need to validate auth for the user
    await this.validateAuth(id, user);

    // 2. We logout the user
    await this.logoutUser(user);

    return {
      status: 'deleted',
    };
  }

  // === Helpers

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  private async getCredentials(
    user: User,
    application: Application,
  ): Promise<CredentialsDto> {
    let didRollBack = false;
    let auth: Authentication;

    // 1. We prepare and start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. We need to delete the current auth if needed
      const deleteResult = await this.authService.deleteCurrentAuth(
        queryRunner,
        user,
      );

      // 3. We need to create an authentication object and connect it the application
      auth = await this.authService.createAndSave(
        queryRunner,
        {
          user,
          application,
        },
      );

      // 4. We commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // TODO: Check if error is of type QueryFailedError. If true, cast
      // and retrieve the error code to allow for correct message.
      // If an error occurred, we need to rollback the changes made.
      // 23505	unique_violation
      await queryRunner.rollbackTransaction();
      console.log(error);

      didRollBack = true;
    } finally {
      await queryRunner.release();
    }

    if (didRollBack || !auth) {
      throw new BadRequestException();
    }

    // 5. We get the user infos
    const userInfos = UsersService.getEntityInfos(user);

    // 6. Return the data
    return {
      auth: auth,
      response: {
        id: auth.id,
        token: auth.token,
        user: userInfos,
      },
    };
  }
  private async logoutUser(user: User) {
    let didRollBack = false;

    // 1. We prepare and start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. We need to delete the current auth if needed
      const deleteResult = await this.authService.deleteCurrentAuth(
        queryRunner,
        user,
      );

      // 4. We commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // TODO: Check if error is of type QueryFailedError. If true, cast
      // and retrieve the error code to allow for correct message.
      // If an error occurred, we need to rollback the changes made.
      // 23505	unique_violation
      await queryRunner.rollbackTransaction();
      console.log(error);

      didRollBack = true;
    } finally {
      await queryRunner.release();
    }

    if (didRollBack) {
      throw new BadRequestException();
    }
  }
  /* eslint-enable  @typescript-eslint/no-unused-vars */
  private async validateAuth(id: string, user: User): Promise<Authentication> {
    // 1. We need to get the current auth
    const currentAuth = await this.authService.findOneById(id);

    // We should later extract this logic to CASL authorizations
    if (!currentAuth) {
      throw new UnauthorizedException();
    }
    if (currentAuth.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    return currentAuth;
  }
}

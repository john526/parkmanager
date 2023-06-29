import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { AppKeyGuard } from '../applications/app-key.guard';
import { HiddenHeaderAPIKeyGuard } from '../auth/hidden-header-api-key-auth.guard';
import { QueryErrorCodes } from '../common/dto/expected-error-set.dto';
import { HelperService } from '../helper/helper.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@UseGuards(AppKeyGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly connection: Connection,
    private readonly entitiesService: UsersService,
  ) {}

  @UseGuards(HiddenHeaderAPIKeyGuard)
  @Post()
  async create(@Body() payload: CreateUserDto) {
    // We just add an app and return
    // Prepare the transaction
    let didRollBack = false;
    let errorObject: any;
    let newUser: User;

    // We prepare and start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      newUser = await this.entitiesService.createAndSaveWithRunner(
        queryRunner,
        payload,
      );

      // We commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      errorObject = error;
      didRollBack = true;
    } finally {
      await queryRunner.release();
    }

    if (errorObject) {
      const message =
        HelperService.getErrorMessageFromError(errorObject, {
          [QueryErrorCodes.UNIQUE_VIOLATION]: 'Cet utilisateur existe déjà.',
        }) ??
        `Une erreur est survenue pendant la création du compte utilisateur. ${errorObject?.message}`;

      throw new BadRequestException(message, errorObject?.message);
    }

    if (didRollBack || !newUser) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du compte utilisateur.',
      );
    }

    return newUser;
  }

  @UseGuards(HiddenHeaderAPIKeyGuard)
  @Patch('reset-password')
  async resetPassword(@Body() payload: any) {
    // We find the user first
    let user: User;

    try {
      user = await this.entitiesService.findOneByUsernameOrEmail(payload.email);
    } catch (error) {
      throw new BadRequestException(
        'Aucun utilisateur trouvé pour ces conditions.',
      );
    }

    if (!user) {
      throw new BadRequestException(
        'Aucun utilisateur trouvé pour ces conditions.',
      );
    }

    // We reset the password
    let didRollBack = false;
    let errorObject: any;

    // We prepare and start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.entitiesService.updateUserPassword(
        queryRunner,
        user,
        payload.password,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);

      didRollBack = true;
      errorObject = error;
    } finally {
      await queryRunner.release();
    }

    if (didRollBack) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la réinitialisation du mot de passe. ${errorObject?.message}`,
        errorObject?.message,
      );
    }

    return {
      status: 'success',
      message: 'password updated',
    };
  }

  @UseGuards(HiddenHeaderAPIKeyGuard)
  @Patch('/update-user/:id')
  async updateUserInformationWithoutPassword(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ) {
    let user: User;
    try {
      user = await this.entitiesService.findOneById(id);
    } catch (error) {
      throw new BadRequestException(
        'Aucun utilisateur trouvé pour ces conditions.',
      );
    }

    if (!user) {
      throw new BadRequestException(
        'Aucun utilisateur trouvé pour ces conditions.',
      );
    }

    // We reset the password
    let didRollBack = false;
    let errorObject: any;

    // We prepare and start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.entitiesService.updateUserInformationWithoutPassword(
        queryRunner,
        user,
        payload,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);

      didRollBack = true;
      errorObject = error;
    } finally {
      await queryRunner.release();
    }

    if (didRollBack) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour des informations de l'utilisateur. ${errorObject?.message}`,
        errorObject?.message,
      );
    }

    return {
      status: 'success',
      message: 'information updated',
    };
  }
}

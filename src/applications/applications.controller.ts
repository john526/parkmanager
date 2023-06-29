import { Body, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { Connection } from 'typeorm';
import { HiddenHeaderAPIKeyGuard } from '../auth/hidden-header-api-key-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateAppDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';


@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly connection: Connection,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @UseGuards(HiddenHeaderAPIKeyGuard)
  @Post()
  async create(
    @Body() payload: CreateAppDto,
  ) {
    // We just add an app and return
    // Prepare the transaction
    let didRollBack = false;
    let newApp: Application;

    // We prepare and start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      newApp = await this.applicationsService.createAndSaveWithRunner(queryRunner, payload);
      
      // We commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);

      didRollBack = true;
    } finally {
      await queryRunner.release();
    }

    if (didRollBack || !newApp) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de l\'application.',
      );
    }

    return newApp;
  }
}

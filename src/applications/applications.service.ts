import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { HelperService } from '../helper/helper.service';
import { CreateAppDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';


@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly helperService: HelperService,
  ) { }


  performCreateAndSave(app: CreateAppDto) {
    const anApp = new Application();
    anApp.id = this.helperService.generateShortId('app');
    anApp.name = app.name;
    anApp.token = app.token ?? this.helperService.generateShortId('app_tk');
    anApp.description = app.description ?? '';
    return anApp;
  }
  async createAndSave(app: CreateAppDto) {
    const anApp = this.performCreateAndSave(app);
    const newApp = await this.applicationRepository.save(anApp);
    return newApp;
  }
  async createAndSaveWithRunner(queryRunner: QueryRunner, app: CreateAppDto) {
    const anApp = this.performCreateAndSave(app);
    const newApp = await queryRunner.manager.save(anApp);
    return newApp;
  }

  async findOneByToken(token: string): Promise<Application> {
    return this.applicationRepository.findOne({
      where: {
        token,
      },
    });
  }

  async validateApplication(appKey: string): Promise<Application | null> {
    const app = await this.findOneByToken(appKey);
    if (app) {
      return app;
    }
    return null;
  }
}

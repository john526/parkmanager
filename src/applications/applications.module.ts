import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { HelperModule } from '../helper/helper.module';
import { Application } from './entities/application.entity';
import { Authentication } from '../auth/entities/authentication.entity';
import { AppKeyStrategy } from './header-app-key.strategy';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [ApplicationsController],
  imports: [
    PassportModule,
    HelperModule,
    TypeOrmModule.forFeature([
      Application,
      User,
      Authentication,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [ApplicationsService, AppKeyStrategy],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}

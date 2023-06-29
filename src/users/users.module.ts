import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsModule } from '../applications/applications.module';
import { Application } from '../applications/entities/application.entity';
import { AuthModule } from '../auth/auth.module';
import { Authentication } from '../auth/entities/authentication.entity';
import { HelperModule } from '../helper/helper.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Application,
      User,
      Authentication,
    ]),
    HelperModule,
    ApplicationsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }

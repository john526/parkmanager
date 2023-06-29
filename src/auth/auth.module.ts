import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsModule } from '../applications/applications.module';
import { Application } from '../applications/entities/application.entity';
import { JWTConfigService } from '../config/jwt-config.service';
import { HelperModule } from '../helper/helper.module';
import { User } from '../users/entities/user.entity';
import { AuthenticationsController } from './auth.controller';
import { AuthService } from './auth.service';
import { Authentication } from './entities/authentication.entity';
import { FullAuthenticationStrategy } from './full-authentication.strategy';
import { HiddenHeaderApiKeyStrategy } from './hidden-header-api-key.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    forwardRef(()=>UsersModule),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useClass: JWTConfigService,
      inject: [JWTConfigService],
    }),
    HelperModule,
    forwardRef(()=>ApplicationsModule),
    TypeOrmModule.forFeature([
      Application,
      User,
      Authentication,
    ]),
  ],
  controllers: [AuthenticationsController],
  providers: [
    AuthService,
    FullAuthenticationStrategy,
    LocalStrategy,
    HiddenHeaderApiKeyStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }

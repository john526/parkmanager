import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';
import { HelperModule } from './helper/helper.module';
import { ParkingModule } from './parking/parking.module';
import { ParkingPlaceModule } from './parking-place/parking-place.module';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { UsersController } from './users/users.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDBConfigService } from './config/postgres-config.service';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresDBConfigService,
      inject: [PostgresDBConfigService],
    }),
    UsersModule, 
    AuthModule, 
    ApplicationsModule, 
    HelperModule, 
    ParkingModule, 
    ParkingPlaceModule, 
    EntrepriseModule, CaslModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}

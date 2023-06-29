import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { HelperService } from "../helper/helper.service";


@Injectable()
export class PostgresDBConfigService implements TypeOrmOptionsFactory {
    
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
        
    return {
      type: 'postgres',
      host: this.configService.get<string>("TYPEORM_HOST"),
      port: this.configService.get<number>("TYPEORM_PORT"),
      username: this.configService.get<string>("TYPEORM_USERNAME"),
      password: this.configService.get<string>("TYPEORM_PASSWORD"),
      database: this.configService.get<string>("TYPEORM_DATABASE"),
      synchronize: false,
      entities: ['dist/**/*.entity.js'],
      autoLoadEntities: true,
      ssl: HelperService.getConfigBoolValue(this.configService, 'TYPEORM_SSL'), 
      migrations: ['dist/migrations/**/*.js'],
      migrationsTableName:
                this.configService.get<string>('TYPEORM_MIGRATIONS_TABLE_NAME') ??
                'migrations',
      migrationsRun: false,
    };
  }
}
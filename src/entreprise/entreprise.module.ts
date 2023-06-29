import { Module } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { EntrepriseController } from './entreprise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entreprise } from './entities/entreprise.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports:[
    TypeOrmModule.forFeature(
      [Entreprise],
    ),
    HelperModule
  ],
  providers: [EntrepriseService],
  controllers: [EntrepriseController],
  exports:[EntrepriseService]
})
export class EntrepriseModule {}

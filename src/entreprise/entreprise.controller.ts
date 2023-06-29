import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { CreateEntrepriseDto, UpdateEntrepiseDto } from './dto/entreprise.dto';

@Controller('entreprise')
export class EntrepriseController {

  constructor(
    private readonly entrepriseService: EntrepriseService
  ){}

  @Post()
  async createEntreprise(@Body() payload: CreateEntrepriseDto) {

    try {
      
    } catch (error) {
      
    }
    return this.entrepriseService.createEntreprise(payload);
  }

  @Get()
  async findByName(
    @Query('name') name: string
  ) {
    if(!name) return null;

    return this.entrepriseService.findOneByName(name);
  }

  @Get()
  async findAll() {
    return this.entrepriseService.findAll();
  }

  @Patch()
  async updateEntreprise(@Body() payload: UpdateEntrepiseDto) {
    try {
      
    } catch (error) {
      
    }

    return this.entrepriseService.updateEntreprise(payload.id, payload);
  }

  @Delete()
  async deleteEntreprise(
    @Param('id') id: string
  ) {
    if(!id) return null;

    return this.entrepriseService.deleteEntreprise(id);
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Entreprise } from './entities/entreprise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from '../helper/helper.service';
import { CreateEntrepriseDto, UpdateEntrepiseDto } from './dto/entreprise.dto';

@Injectable()
export class EntrepriseService {
  constructor(
    @InjectRepository(Entreprise)
    private readonly repository : Repository<Entreprise>,
    private readonly helperService: HelperService
  ){}

  async createEntreprise(dto: CreateEntrepriseDto) {

    const entreprise = new Entreprise();

    entreprise.id = this.helperService.generateShortId('entr');
    entreprise.name = dto.name;
    entreprise.space = dto.space;
    entreprise.user = dto.user;

    return this.repository.save(entreprise);
  }

  // dto pour faire les recherches sur tout les champs
  async findAll(): Promise<Entreprise[]> {
    return this.repository.find({
      relations:['user']
    });
  }

  async findOneByName(name: string) : Promise<Entreprise> {
    if(!name) return null;

    return this.repository.findOne({
      where:{
        name
      },
      relations:['user']
    })
  }

  async updateEntreprise(id:string, dto: UpdateEntrepiseDto) {

    if(!id) return id;
    return this.repository.update(id, dto);
  }

  async deleteEntreprise(id: string) {
    if(!id) return null;

    return this.repository.delete(id);
  }
}

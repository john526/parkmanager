import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { HelperService } from '../helper/helper.service';
import { CreateUserDto, HiddenUser, UserInfos, UpdateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  private readonly hiddenUsers: HiddenUser[];

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly helperService: HelperService,
    private readonly configService: ConfigService,
  ) {

    const hiddenApiKey =
      this.configService.get<string>('HIDDEN_API_KEY') ??
      '51dbe9781fbfb95f88ac6843f37c13fa571fe855e7704a9c7f22057193af1bd62d7c61bce0cd7796dd23936a700b47cdfee12a75af99b2be04658270b3f05f69';
    this.hiddenUsers = [
      {
        username: 'parkmangager',
        apiKey: hiddenApiKey,
      },
    ];
  }


  private async performCreateAndSave(user: CreateUserDto): Promise<User> {
    const aUser = new User();

    aUser.id = this.helperService.generateShortId('us');
    aUser.name = user.name;
    aUser.username = user.username;
    aUser.password = await this.helperService.hashPassword(user.password);
    aUser.email = user.email;
    aUser.entreprise = user.entreprise;
    aUser.role = user.role;

    return aUser;
  }

  async createAndSaveWithRunner(
    queryRunner: QueryRunner,
    user: CreateUserDto,
  ): Promise<User> {
    const aUser = await this.performCreateAndSave(user);
    return queryRunner.manager.save(aUser);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.repository.findOne({
      where: { username },
      relations: [
        'authentication',
      ],
    });
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    if(!usernameOrEmail) return null;

    return this.repository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      relations: ['authentication'],
    });
  }

  async findOneById(id: string): Promise<User> {
    if (!id) {
      return null;
    }

    const options: FindOneOptions<User> = this.itemFindOptions();
    return this.repository.findOne({
      where:{
        id
      },
      relations:['authentication']
    }); // id, options
  }

  async findHiddenOneByApiKey(key: string): Promise<User | undefined> {
    const user: User = new User();

    const foundOne = this.hiddenUsers.find((user) => user.apiKey === key);

    if (!foundOne) {
      return undefined;
    }

    user.username = foundOne.username;
    return user;
  }

  public static getEntityInfos(user: User): UserInfos {
    const { id, name, username, email, createDate, role, entreprise} = user;

    return {
      id,
      name,
      username,
      email,
      createDate,
      role,
      entreprise
    };
  }

  async updateUserPassword(
    queryRunner: QueryRunner,
    user: User,
    password: string,
  ) {
    return queryRunner.manager.update(
      User,
      {
        id: user.id,
      },
      {
        password: await this.helperService.hashPassword(password),
      },
    );
  }

  // === Helpers methods
  private itemFindOptions(): FindOneOptions<User> {
    const options: FindOneOptions<User> = {
      relations: [
        'authentication',
      ],
    };

    return options;
  }

  // update user information without password
  async updateUserInformationWithoutPassword(
    queryRunner: QueryRunner,
    user: User,
    payload: UpdateUserDto,
  ) {
    return queryRunner.manager.update(
      User,
      {
        id: user.id,
      },
      payload
    );
  }
  
  async remove(id: string) {
    if(!id) return null;

    return this.repository.delete(id);
  }
}

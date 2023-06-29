import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';


const cors = require('cors');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get<number>("API_PORT");
  
  app.use(cookieParser());
  
  await app.listen(port);
}
bootstrap();

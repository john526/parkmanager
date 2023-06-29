import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe} from 'nanoid-dictionary';
import * as bcrypt from 'bcrypt';
import {
  ExpectedErrorSetDto,
  QueryErrorCodes,
} from '../common/dto/expected-error-set.dto';
import { QueryFailedError } from 'typeorm';
import { addDays} from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelperService {

  public generateShortId(prefix: string = null) {
    const uuid = customAlphabet(nolookalikesSafe, 14)();
    if (prefix) {
      return `${prefix}_${uuid}`;
    }
    return uuid;
  }

  public async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  }

  static getErrorMessageFromError(
    error: any,
    expectedErrorSet: ExpectedErrorSetDto = {},
  ): string {
    if (error instanceof QueryFailedError) {
      const queryError: QueryFailedError = error as QueryFailedError;
      const code = queryError.driverError.code;
      console.log('const code = queryError.driverError.code;', code);

      const message = expectedErrorSet[code];
      switch (code) {
        case QueryErrorCodes.FOREIGN_KEY_VIOLATION:
          return message ?? 'Impossible de supprimer cette occurrence.';
        case QueryErrorCodes.UNIQUE_VIOLATION: // Unique constraint
          return message ?? 'Une occurrence similaire existe déjà.';

        default:
          return undefined;
      }
    }

    return undefined;
  }

  public async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  public getExpirationDate(numberOfDays = 1): Date {
    return addDays(new Date(), numberOfDays);
  }

  // === This is to deal with the fact that sslValue can still be a string despite <boolean>
  // Maybe it is a platform specific thing.
  // FOr the moment, I will check and force a boolean value if needed
  public static getConfigBoolValue(
    configService: ConfigService,
    key: string,
  ): boolean {
    const rawConfigValue = configService.get<boolean>(key);
    let configValue = false;
    if (typeof rawConfigValue === 'boolean') {
      configValue = rawConfigValue;
    }
    if (typeof rawConfigValue === 'string') {
      const sslString = rawConfigValue as string;
      configValue = sslString === 'true';
    }
    return configValue;
  }

}

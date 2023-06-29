import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HIDDEN_HEADER_API_KEY_STRATEGY } from './hidden-header-api-key.strategy';


@Injectable()
export class HiddenHeaderAPIKeyGuard extends AuthGuard(
  HIDDEN_HEADER_API_KEY_STRATEGY,
) {}

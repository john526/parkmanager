import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HEADER_APP_KEY } from '../header-app-key.strategy';


export const ReqAppKey = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const appKey = request.headers[HEADER_APP_KEY];

    return appKey;
  },
);

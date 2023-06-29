import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import * as rawBody from "raw-body";

export const PlainBody = createParamDecorator(async (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<import("express").Request>();
    if (!req.readable) { throw new BadRequestException("Invalid body"); }

    const body = (await rawBody(req)).toString("utf8").trim();
    return body;
})


// import * as rawbody from 'raw-body';
// import { createParamDecorator, HttpException, HttpStatus } from '@nestjs/common';

// export const PlainBody = createParamDecorator(async (data, req) => {
//   if (req.readable) {
//     return (await rawbody(req)).toString().trim();
//   }
//   throw new HttpException('Body is not text/plain', HttpStatus.INTERNAL_SERVER_ERROR);
// });

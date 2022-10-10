import {Injectable, NestMiddleware} from '@nestjs/common';
import jwtDecode from "jwt-decode";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerToken = req.headers.authorization!.split(" ")[1]

    req.userId = (jwtDecode(headerToken) as any).sub
    next();
  }
}

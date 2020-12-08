import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      const res = authorization.split(' ');

      if (res[0] != 'Bearer') {
        return false;
      }

      jwt.verify(res[1], process.env.JWT_SECRET);

      return true;
    } catch (err) {
      return false;
    }
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { EtcdService } from '../../etcd/etcd.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly etcdService: EtcdService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const res = authorization.split(' ');

        if (res[0] != 'Bearer') {
          resolve(false);
        }

        jwt.verify(
          res[1],
          (await this.etcdService.get('JWT_SECRET')) || 'aRandomKey',
        );

        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }
}

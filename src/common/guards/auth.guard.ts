import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as jwt from 'jsonwebtoken';
import { EtcdService } from '../../etcd/etcd.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly etcdService: EtcdService,
    @InjectKnex() private readonly knex: Knex,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;

      if (authorization == null) {
        resolve(false);
        return;
      }

      const res = authorization.split(' ');

      if (res.length < 2 || res[0] != 'Bearer') {
        resolve(false);
        return;
      }

      jwt.verify(
        res[1],
        (await this.etcdService.get('JWT_SECRET')) || 'aRandomKey',
        async (err, decoded) => {
          if (err) {
            resolve(false);
            return;
          }

          const user = await this.knex
            .select('*')
            .from('users')
            .where('userId', decoded.userId);

          if (user.length === 0) {
            resolve(false);
            return;
          }

          resolve(true);
        },
      );
    });
  }
}

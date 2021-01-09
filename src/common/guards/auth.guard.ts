import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PG_CONNECTION } from '../../constants';
import { EtcdService } from '../../etcd/etcd.service';
import { Pool } from 'pg';
import { UsuarioI } from '../../usuario/interfaces/usuario.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly etcdService: EtcdService,
    @Inject(PG_CONNECTION) private readonly pool: Pool,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      let decoded: UsuarioI;

      if (authorization == null) {
        resolve(false);
        return;
      }

      const res = authorization.split(' ');

      if (res.length < 2 || res[0] != 'Bearer') {
        resolve(false);
        return;
      }

      try {
        decoded = jwt.verify(
          res[1],
          (await this.etcdService.get('JWT_SECRET')) || 'aRandomKey',
        ) as UsuarioI;
      } catch (error) {
        resolve(false);
        return;
      }

      const user = await this.pool.query(
        `SELECT * FROM users WHERE "userId" = '${decoded.userId}'`,
      );

      if (user.rowCount === 0) {
        resolve(false);
        return;
      }

      resolve(true);
    });
  }
}

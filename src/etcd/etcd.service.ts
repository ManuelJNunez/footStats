import { Injectable } from '@nestjs/common';
import { Etcd3 } from 'etcd3';

@Injectable()
export class EtcdService {
  private client: Etcd3 = new Etcd3({
    hosts: `${process.env['ETCD_HOST']}:${process.env['ETCD_PORT']}`,
  });

  getClient() {
    return this.client;
  }

  async get(key: string) {
    let res;

    try {
      res = await this.client.get(key);
    } catch (error) {
      res = process.env[key];
    }

    return res;
  }
}

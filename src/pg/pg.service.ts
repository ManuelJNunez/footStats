import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PgService {
  private readonly pool: Pool;
  private readonly logger = new Logger('PostgreSQL');

  constructor() {
    this.pool = new Pool({
      user: process.env['DB_USER'],
      host: process.env['DB_HOST'],
      database: process.env['DB_NAME'],
      password: process.env['DB_PASSWORD'],
      port: parseInt(process.env['DB_PORT']),
    });
  }

  getPool() {
    return this.pool;
  }
}

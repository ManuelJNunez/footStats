import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../constants';

const dbConnection = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
  }),
};

@Module({
  providers: [dbConnection],
  exports: [dbConnection],
})
export class PgModule {}

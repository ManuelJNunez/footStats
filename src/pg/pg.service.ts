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

    this.createTables()
      .then(() => {
        this.logger.log(
          'Tablas de la base de datos creadas con éxito o ya existían',
        );
      })
      .catch(() => {
        this.logger.log('Error al crear las tablas de la base de datos');
      });
  }

  private async createTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        userId SERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        nickname VARCHAR(20) NOT NULL,
        password VARCHAR(20) NOT NULL
      )
    `);

    await this.pool.query(`
    CREATE TABLE IF NOT EXISTS partidos (
      matchID SERIAL PRIMARY KEY,
      beginDate DATE NOT NULL DEFAULT CURRENT_DATE,
      endDate DATE NOT NULL,
      lugar VARCHAR(30)
    )
  `);
  }

  getPool() {
    return this.pool;
  }
}

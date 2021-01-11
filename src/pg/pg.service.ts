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
        "userId" SERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        nickname VARCHAR(20) NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);

    await this.pool.query(`
    CREATE TABLE IF NOT EXISTS matches (
      "matchId" SERIAL PRIMARY KEY,
      "horaIni" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "horaFin" timestamp NOT NULL,
      lugar VARCHAR(30),
      "userId" INT,
      CONSTRAINT userId FOREIGN KEY ("userId") REFERENCES users("userId")
    )
  `);
  }

  getPool() {
    return this.pool;
  }
}

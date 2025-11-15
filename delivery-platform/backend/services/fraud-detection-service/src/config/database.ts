import { Pool } from 'pg';

export class DatabaseClient {
  private static instance: Pool;

  static getInstance(): Pool {
    if (!this.instance) {
      this.instance = new Pool({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DB || 'delivery_platform',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      this.instance.on('connect', () => console.log('Database connected'));
      this.instance.on('error', (err) => console.error('Unexpected database error', err));
    }

    return this.instance;
  }
}

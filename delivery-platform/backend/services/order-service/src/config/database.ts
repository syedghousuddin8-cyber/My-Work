import { Pool } from 'pg';
import { logger } from '@delivery/shared';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectDatabase = async () => {
  try {
    await pool.connect();
    logger.info('Order Service: PostgreSQL connected');
  } catch (error) {
    logger.error('Order Service: PostgreSQL connection failed', error);
    throw error;
  }
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

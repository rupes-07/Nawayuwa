const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

/**
 * Direct Postgres connection pool.
 * Optional — most CRUD should go through Supabase's client (src/config/supabase.js).
 * Use this pool only when you need raw SQL, transactions, or migrations
 * that the Supabase client doesn't conveniently support.
 */
let pool = null;

function getPool() {
  if (!env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.isProduction ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      logger.error(`Unexpected Postgres pool error: ${err.message}`);
    });
  }

  return pool;
}

async function query(text, params) {
  const activePool = getPool();
  if (!activePool) {
    throw new Error('DATABASE_URL is not configured; direct SQL access is unavailable.');
  }
  const start = Date.now();
  const result = await activePool.query(text, params);
  const duration = Date.now() - start;
  logger.debug(`Executed query in ${duration}ms: ${text}`);
  return result;
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  getPool,
  query,
  closePool,
};

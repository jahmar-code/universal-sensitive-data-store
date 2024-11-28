import mariadb from 'mariadb';

const CONNECTION_LIMIT = 10;

// This is horrific but I'm not sure how to share pool access with serverless functions in a better way
declare global {
  // eslint-disable-next-line no-var
  var mariadbPool: mariadb.Pool | undefined;
}

let pool: mariadb.Pool;

if (!global.mariadbPool) {
  global.mariadbPool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: CONNECTION_LIMIT,
  });
  console.log('Created new MariaDB connection pool.');
}

pool = global.mariadbPool;

export { pool };
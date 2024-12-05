/**
 * Database connector with built-in connection pooling and hash-based load-balancer.
 */


/////// making too many connection pools - implement one instance
import mariadb from 'mariadb';

const CONNECTION_LIMIT = 10;

interface PoolWithHost {
  pool: mariadb.Pool;
  host: string;
}

// This is horrific but I'm not sure how to share pool access with serverless functions in a better way
declare global {
  // eslint-disable-next-line no-var
  var mariadbPools: PoolWithHost[] | undefined
}

let pools: PoolWithHost[];

if (!global.mariadbPools) {
  const hosts = process.env.DB_HOSTS
    ? process.env.DB_HOSTS.split(',').map((host) => host.trim())
    : ['mariadb_node1', 'mariadb_node2', 'mariadb_node3']; // Default hosts if not specified

  global.mariadbPools = hosts.map((host) => ({
    pool: mariadb.createPool({
      host: host,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: CONNECTION_LIMIT,
    }),
    host: host,
  }));

  console.log('Created new MariaDB connection pools.');
}

pools = global.mariadbPools;


//////



/**
 * Simple hash function to convert a string into a numeric hash.
 * @param str - The input string to hash.
 * @returns A non-negative integer hash.
 */
function hashStringToNumber(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash * 31 + char) % Number.MAX_SAFE_INTEGER;
  }
  return Math.abs(hash);
}

/**
 * Gets a database connection using hash-based selection and retries.
 * @param key - The key to hash (e.g., client IP address).
 * @returns A promise that resolves to a database connection.
 * @throws An error if all connection attempts fail.
 */
async function getConnection(key: string): Promise<mariadb.PoolConnection> {
  const hash = hashStringToNumber(key);
  const index = hash % pools.length;

  // Try each pool starting from the hashed index
  for (let i = 0; i < pools.length; i++) {
    const poolIndex = (index + i) % pools.length;
    const { pool, host } = pools[poolIndex];
    try {
      console.log(`Attempting to get connection from pool at host ${host}`);
      return await pool.getConnection();
    } catch (error) {
      console.error(`Failed to get connection from pool at host ${host}:`, error);
      // Proceed to try the next pool
    }
  }

  throw new Error('All database connection attempts failed.');
}

export { getConnection };
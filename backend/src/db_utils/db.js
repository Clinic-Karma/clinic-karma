import { neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Improve connection stability and cold start behavior for Neon
neonConfig.fetchConnectionCache = true; // reuse fetch connections across queries
neonConfig.fetchTimeout = 30000; // increase connect/query timeout to 30s to avoid UND_ERR_CONNECT_TIMEOUT

const sql = neon(process.env.DATABASE_URL);

export { sql };
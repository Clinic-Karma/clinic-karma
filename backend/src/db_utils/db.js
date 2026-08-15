import { neon, neonConfig } from '@neondatabase/serverless';
import { requireEnvironmentVariable } from '../config/env.js';

// Improve connection stability and cold start behavior for Neon
neonConfig.fetchTimeout = 30000; // increase connect/query timeout to 30s to avoid UND_ERR_CONNECT_TIMEOUT

const sql = neon(requireEnvironmentVariable('DATABASE_URL'));

export { sql };

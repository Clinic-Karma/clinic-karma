import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const REQUIRED_VARIABLES = [
  'DATABASE_URL',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
];

const POSTGRES_PROTOCOLS = new Set(['postgres:', 'postgresql:']);

export function validateEnvironment(source = process.env) {
  const missing = REQUIRED_VARIABLES.filter((name) => !source[name]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Copy .env.example to .env and provide real values.'
    );
  }

  let databaseUrl;
  try {
    databaseUrl = new URL(source.DATABASE_URL);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  if (!POSTGRES_PROTOCOLS.has(databaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the postgres:// or postgresql:// protocol.');
  }

  const port = Number(source.PORT ?? 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  if (source.NODE_ENV === 'production') {
    for (const name of ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET']) {
      if (source[name].length < 32) {
        throw new Error(`${name} must contain at least 32 characters in production.`);
      }
    }
  }

  return {
    databaseUrl: source.DATABASE_URL,
    accessTokenSecret: source.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: source.REFRESH_TOKEN_SECRET,
    accessTokenExpires: source.ACCESS_TOKEN_EXPIRES || '15m',
    refreshTokenExpires: source.REFRESH_TOKEN_EXPIRES || '30d',
    frontendUrl: source.FRONTEND_URL || 'http://localhost:8080',
    nodeEnv: source.NODE_ENV || 'development',
    port,
  };
}

export function requireEnvironmentVariable(name, source = process.env) {
  const value = source[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      'Copy .env.example to .env and provide a real value.'
    );
  }
  return value;
}

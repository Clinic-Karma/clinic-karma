import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnvironment } from '../src/config/env.js';

const validEnvironment = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/clinic_karma',
  ACCESS_TOKEN_SECRET: 'a'.repeat(32),
  REFRESH_TOKEN_SECRET: 'b'.repeat(32),
  NODE_ENV: 'production',
  PORT: '5000',
};

test('validateEnvironment returns normalized configuration', () => {
  const result = validateEnvironment(validEnvironment);

  assert.equal(result.port, 5000);
  assert.equal(result.frontendUrl, 'http://localhost:8080');
  assert.equal(result.accessTokenExpires, '15m');
  assert.equal(result.refreshTokenExpires, '30d');
});

test('validateEnvironment reports every missing required variable', () => {
  assert.throws(
    () => validateEnvironment({}),
    /DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET/
  );
});

test('validateEnvironment rejects an invalid database protocol', () => {
  assert.throws(
    () => validateEnvironment({ ...validEnvironment, DATABASE_URL: 'https://example.com' }),
    /postgres:\/\/ or postgresql:\/\//
  );
});

test('validateEnvironment rejects weak production secrets', () => {
  assert.throws(
    () => validateEnvironment({ ...validEnvironment, ACCESS_TOKEN_SECRET: 'short' }),
    /ACCESS_TOKEN_SECRET must contain at least 32 characters/
  );
});

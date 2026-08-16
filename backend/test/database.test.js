import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { splitSqlStatements } from '../scripts/lib/sql-statements.js';

const backendDirectory = path.resolve(import.meta.dirname, '..');

test('SQL splitter preserves function bodies and quoted semicolons', () => {
  const source = `
    CREATE TABLE example (id int, value text);
    CREATE FUNCTION example_fn() RETURNS void AS $$
    BEGIN
      PERFORM 'a;b';
    END
    $$ LANGUAGE plpgsql;
    -- final statement
    CREATE INDEX example_idx ON example (id);
  `;

  const statements = splitSqlStatements(source);
  assert.equal(statements.length, 3);
  assert.match(statements[1], /PERFORM 'a;b'/);
});

test('canonical database files contain repaired names and status constraints', async () => {
  const schema = await readFile(path.join(backendDirectory, 'database', 'schema.sql'), 'utf8');
  const migration = await readFile(
    path.join(backendDirectory, 'database', 'migrations', '001_repair_legacy_schema.sql'),
    'utf8',
  );
  const bookingMigration = await readFile(
    path.join(backendDirectory, 'database', 'migrations', '002_transactional_booking_and_guards.sql'),
    'utf8',
  );
  const combined = `${schema}\n${migration}\n${bookingMigration}`;

  assert.match(schema, /CREATE TABLE refresh_tokens/);
  assert.match(schema, /token_hash char\(64\)/);
  assert.match(schema, /Patient_Insurance_ID/);
  assert.match(schema, /billing_amounts_check/);
  assert.match(migration, /UPDATE "Appointment" SET "Status" = 'Confirmed'/);
  assert.match(bookingMigration, /FUNCTION book_consultation/);
  assert.match(bookingMigration, /pg_advisory_xact_lock/);
  assert.match(bookingMigration, /validate_insurance_claim_relationship/);
  assert.doesNotMatch(combined, /refersh_tokens/);
  assert.doesNotMatch(schema, /Specilization/);
});

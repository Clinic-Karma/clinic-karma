import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from '../src/db_utils/db.js';
import { splitSqlStatements } from './lib/sql-statements.js';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendDirectory = path.resolve(scriptsDirectory, '..');
const migrationsDirectory = path.join(backendDirectory, 'database', 'migrations');
const baselinePath = path.join(backendDirectory, 'database', 'schema.sql');
const dryRun = process.argv.includes('--dry-run');

const checksum = (source) => createHash('sha256').update(source).digest('hex');

async function applyStatements(statements, ledgerEntry) {
  if (dryRun) return;

  const queries = statements.map((statement) => sql.query(statement));
  queries.push(sql.query(
    `INSERT INTO schema_migrations (version, name, checksum)
     VALUES ($1, $2, $3)`,
    [ledgerEntry.version, ledgerEntry.name, ledgerEntry.checksum],
  ));

  await sql.transaction(queries, { isolationLevel: 'Serializable' });
}

await sql.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version varchar(40) PRIMARY KEY,
    name text NOT NULL,
    checksum char(64) NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
  )
`);

const existingCoreTable = await sql.query(`
  SELECT to_regclass('public."User"') IS NOT NULL AS exists
`);
const appliedRows = await sql.query('SELECT version, name, checksum FROM schema_migrations ORDER BY version');
const applied = new Map(appliedRows.map((row) => [row.version, row]));

if (!existingCoreTable[0].exists) {
  const source = await readFile(baselinePath, 'utf8');
  const entry = { version: '000', name: 'canonical baseline', checksum: checksum(source) };
  console.log(`${dryRun ? 'Would apply' : 'Applying'} 000 canonical baseline (${splitSqlStatements(source).length} statements)`);
  await applyStatements(splitSqlStatements(source), entry);
  applied.set(entry.version, entry);
} else if (!applied.has('000')) {
  const source = await readFile(baselinePath, 'utf8');
  const entry = { version: '000', name: 'pre-migration legacy baseline', checksum: checksum(source) };
  console.log(`${dryRun ? 'Would record' : 'Recording'} existing database as migration baseline`);
  if (!dryRun) {
    await sql.query(
      `INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)`,
      [entry.version, entry.name, entry.checksum],
    );
  }
  applied.set(entry.version, entry);
}

const migrationFiles = (await readdir(migrationsDirectory))
  .filter((file) => /^\d+_[a-z0-9_-]+\.sql$/i.test(file))
  .sort();

for (const file of migrationFiles) {
  const version = file.split('_', 1)[0];
  const name = file.replace(/^\d+_/, '').replace(/\.sql$/i, '').replaceAll('_', ' ');
  const source = await readFile(path.join(migrationsDirectory, file), 'utf8');
  const fileChecksum = checksum(source);
  const previous = applied.get(version);

  if (previous) {
    if (previous.checksum.trim() !== fileChecksum) {
      throw new Error(`Migration ${version} was modified after it was applied.`);
    }
    console.log(`Already applied ${version} ${name}`);
    continue;
  }

  const statements = splitSqlStatements(source);
  console.log(`${dryRun ? 'Would apply' : 'Applying'} ${version} ${name} (${statements.length} statements)`);
  await applyStatements(statements, { version, name, checksum: fileChecksum });
}

console.log(dryRun ? 'Migration dry run complete.' : 'Database migrations are up to date.');

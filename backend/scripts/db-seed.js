import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from '../src/db_utils/db.js';
import { splitSqlStatements } from './lib/sql-statements.js';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(scriptsDirectory, '..', 'database', 'seed.sql');
const source = await readFile(seedPath, 'utf8');
const statements = splitSqlStatements(source);

await sql.transaction(
  statements.map((statement) => sql.query(statement)),
  { isolationLevel: 'Serializable' },
);

console.log(`Reference data is ready (${statements.length} seed statements).`);

import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDirectory, '..');
const examplePath = path.join(backendRoot, '.env.example');
const environmentPath = path.join(backendRoot, '.env');
const secretNames = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];

function readValue(contents, name) {
  const match = contents.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function setValue(contents, name, value) {
  const pattern = new RegExp(`^${name}=.*$`, 'm');
  if (pattern.test(contents)) {
    return contents.replace(pattern, `${name}=${value}`);
  }

  const newline = contents.endsWith('\n') ? '' : '\n';
  return `${contents}${newline}${name}=${value}\n`;
}

function needsGeneratedSecret(value) {
  return !value || value.startsWith('replace-with-');
}

if (!existsSync(examplePath)) {
  throw new Error('.env.example is missing; cannot initialize backend configuration.');
}

const environmentAlreadyExisted = existsSync(environmentPath);
let contents;
if (environmentAlreadyExisted) {
  contents = readFileSync(environmentPath, 'utf8');
} else {
  contents = readFileSync(examplePath, 'utf8');
  // A fake local URL should never be mistaken for a configured database.
  contents = setValue(contents, 'DATABASE_URL', '');
}

const generated = [];
for (const name of secretNames) {
  if (needsGeneratedSecret(readValue(contents, name))) {
    contents = setValue(contents, name, randomBytes(48).toString('base64url'));
    generated.push(name);
  }
}

writeFileSync(environmentPath, contents, { encoding: 'utf8', mode: 0o600 });

console.log(environmentAlreadyExisted ? 'Backend .env was updated.' : 'Backend .env was created.');
if (generated.length > 0) {
  console.log(`Generated secure values for: ${generated.join(', ')}.`);
} else {
  console.log('Existing token secrets were preserved.');
}
if (!readValue(contents, 'DATABASE_URL')) {
  console.log('DATABASE_URL is still empty; add your Neon connection string before starting the API.');
}

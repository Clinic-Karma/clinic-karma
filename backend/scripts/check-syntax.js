import { readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDirectory, '..');
const excludedDirectories = new Set(['node_modules', 'uploads']);

function collectJavaScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    const relativePath = path.relative(backendRoot, fullPath);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return excludedDirectories.has(entry) ? [] : collectJavaScriptFiles(fullPath);
    }

    return entry.endsWith('.js') ? [relativePath] : [];
  });
}

const files = collectJavaScriptFiles(backendRoot);
const failures = [];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: backendRoot,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    failures.push({
      file,
      output: result.stderr || result.stdout || result.error?.message || 'Unknown syntax-check failure',
    });
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Syntax check failed: ${failure.file}`);
    console.error(failure.output.trim());
  }
  process.exit(1);
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`);

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(testDirectory, '..');
const sourceRoot = path.join(backendRoot, 'src');

function collectJavaScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    return statSync(fullPath).isDirectory()
      ? collectJavaScriptFiles(fullPath)
      : entry.endsWith('.js')
        ? [fullPath]
        : [];
  });
}

test('source tree contains no suffixed duplicate modules or imports', () => {
  const files = collectJavaScriptFiles(sourceRoot);
  const duplicateFiles = files.filter((file) => path.basename(file).endsWith('_y.js'));
  const duplicateImports = files.filter((file) => readFileSync(file, 'utf8').includes('_y.js'));

  assert.deepEqual(duplicateFiles, []);
  assert.deepEqual(duplicateImports, []);
});

test('each API router imports its canonical controller', () => {
  const expectedBoundaries = {
    authRouter: 'authController.js',
    patientRouter: 'patientController.js',
    doctorRouter: 'doctorController.js',
    appointmentRouter: 'appointmentController.js',
    branchmanagerRouter: 'branchmanagerController.js',
    topmanagerRouter: 'topmanagerController.js',
  };

  for (const [router, controller] of Object.entries(expectedBoundaries)) {
    const routerSource = readFileSync(path.join(sourceRoot, 'routes', `${router}.js`), 'utf8');
    assert.match(routerSource, new RegExp(`controllers/${controller.replace('.', '\\.')}`));
  }
});

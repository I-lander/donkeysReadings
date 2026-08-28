// Increments the Android versionCode (the Play Store rejects a reused code),
// commits and pushes. Run it before each Play Store upload.
// Usage: node push-new-bundle-version.js

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');

const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
const currentVersionMatch = buildGradleContent.match(/^\s*versionCode\s+(\d+)/m);

if (!currentVersionMatch) {
  console.error('Could not find versionCode in build.gradle');
  process.exit(1);
}

const newVersionCode = parseInt(currentVersionMatch[1], 10) + 1;
fs.writeFileSync(
  buildGradlePath,
  buildGradleContent.replace(/(^\s*versionCode\s+)\d+/m, `$1${newVersionCode}`)
);

console.log(`versionCode is now ${newVersionCode} in build.gradle`);

function git(...args) {
  console.log(`$ git ${args.join(' ')}`);
  execFileSync('git', args, { cwd: rootDir, stdio: 'inherit' });
}

try {
  git('add', './android/app/build.gradle');
  git('commit', '-m', `chore: bump Android versionCode to ${newVersionCode}`);
  git('push');
} catch (error) {
  console.error(`An error occurred: ${error.message}`);
  process.exit(1);
}

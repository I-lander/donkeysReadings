// Bumps the app version (package.json, package-lock.json, android versionName),
// commits, tags v<version> and pushes. The tag push triggers the Android release
// workflow (.github/workflows/build-android.yml).
// Usage: node push-new-version.js [patch|minor|major]  (default: patch)

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(rootDir, 'package.json');
const packageLockJsonPath = path.join(rootDir, 'package-lock.json');
const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonFile(filePath, jsonContent) {
  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2) + '\n');
}

function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);

  switch (type) {
    case 'major':
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1] += 1;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2] += 1;
      break;
  }

  return parts.join('.');
}

const packageJson = readJsonFile(packageJsonPath);
packageJson.version = incrementVersion(packageJson.version, process.argv[2]);
writeJsonFile(packageJsonPath, packageJson);

if (fs.existsSync(packageLockJsonPath)) {
  const packageLockJson = readJsonFile(packageLockJsonPath);
  packageLockJson.version = packageJson.version;
  packageLockJson.packages[''].version = packageJson.version;
  writeJsonFile(packageLockJsonPath, packageLockJson);
}

let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
buildGradleContent = buildGradleContent.replace(
  /versionName\s+"(.+?)"/,
  `versionName "${packageJson.version}"`
);
fs.writeFileSync(buildGradlePath, buildGradleContent);

console.log(
  `Version is now ${packageJson.version} in package.json, package-lock.json and build.gradle`
);

function git(...args) {
  console.log(`$ git ${args.join(' ')}`);
  execFileSync('git', args, { cwd: rootDir, stdio: 'inherit' });
}

try {
  git('add', './package.json', './package-lock.json', './android/app/build.gradle');
  git('commit', '-m', `chore: release v${packageJson.version}`);
  git('tag', `v${packageJson.version}`);
  git('push');
  git('push', '--tags');
} catch (error) {
  console.error(`An error occurred: ${error.message}`);
  process.exit(1);
}

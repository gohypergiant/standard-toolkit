#!/usr/bin/env zx

/*
 * This script will report packages under the react-spectrum (v3) umbrella which have multiple versions in a project repo
 * by looking at the pnpm-lock.yaml file. Any packages that are reported by this script should be
 * fixed to only have 1 imported version so that react-spectrum works correctly in the project repo.
 */
import { fs, YAML } from 'zx';

const patterns = [
  // packages
  '@adobe/react-spectrum',
  'react-stately',
  'react-aria',
  'react-aria-components',

  // scopes
  '@internationalized/',
  '@react-aria/',
  '@react-spectrum/',
  '@react-stately/',
  '@react-types/',
  '@spectrum-icons/',
];

const versions: Record<string, Set<string>> = {};
function addVersion(pkg: string, version: string) {
  if (!versions[pkg]) {
    versions[pkg] = new Set();
  }
  versions[pkg].add(version);
}

function patternMatch(str: string) {
  return patterns.some((pattern) => {
    if (pattern.endsWith('/')) {
      return str.startsWith(pattern);
    }
    return str === pattern;
  });
}

function printConflicts() {
  const title = '| RAC DEPS REPORT |';
  console.log('-'.repeat(title.length));
  console.log(title);
  console.log('-'.repeat(title.length));

  let maxPkgLen = 0;
  let hasConflicts = false;

  Object.entries(versions).forEach(([pkg, pkgVersions]) => {
    if (pkgVersions.size > 1) {
      hasConflicts = true;
      if (pkg.length > maxPkgLen) {
        maxPkgLen = pkg.length;
      }
    }
  });

  if (!hasConflicts) {
    console.log('No version conflicts found! ✓');
    return;
  }

  Object.keys(versions)
    .sort((left, right) => left.localeCompare(right))
    .forEach((pkg) => {
      const pkgVersions = versions[pkg];

      if (pkgVersions && pkgVersions.size > 1) {
        const label = `${pkg} (${pkgVersions.size})`;
        console.log(
          `${label.padEnd(maxPkgLen + 5)} - ${Array.from(pkgVersions)
            .sort((left, right) => left.localeCompare(right))
            .join(', ')}`,
        );
      }
    });

  process.exit(1);
}

// Parse package name and version from pnpm lockfile v9 keys
// Format examples:
//   @react-aria/button@3.9.1
//   react-aria@3.31.0
//   @react-aria/button@3.9.1(@types/react@18.0.0)
function parsePackageKey(key: string) {
  // Handle scoped packages: @scope/name@version
  if (key.startsWith('@')) {
    const lastAtIndex = key.lastIndexOf('@');
    if (lastAtIndex > 0) {
      const pkg = key.slice(0, lastAtIndex);
      const version = key.slice(lastAtIndex + 1).split('(')[0]; // Remove peer dep suffix

      if (!version) {
        throw new Error(`Invalid package key: ${key}`);
      }

      return { pkg, version };
    }
  } else {
    // Handle non-scoped packages: name@version
    const atIndex = key.indexOf('@');
    if (atIndex > 0) {
      const pkg = key.slice(0, atIndex);
      const version = key.slice(atIndex + 1).split('(')[0]; // Remove peer dep suffix

      if (!version) {
        throw new Error(`Invalid package key: ${key}`);
      }

      return { pkg, version };
    }
  }

  return null;
}

async function checkPnpmLock() {
  const fileContents = await fs.promises.readFile('./pnpm-lock.yaml', 'utf8');
  const documents = YAML.parseAllDocuments(fileContents);

  for (const document of documents) {
    if (document.errors.length > 0) {
      throw document.errors[0];
    }

    const lockfile = document.toJSON();
    const packages = lockfile?.packages || {};
    const snapshots = lockfile?.snapshots || {};

    Object.keys(packages).forEach((key) => {
      const parsed = parsePackageKey(key);
      if (parsed && patternMatch(parsed.pkg)) {
        addVersion(parsed.pkg, parsed.version);
      }
    });

    Object.keys(snapshots).forEach((key) => {
      const parsed = parsePackageKey(key);
      if (parsed && patternMatch(parsed.pkg)) {
        addVersion(parsed.pkg, parsed.version);
      }
    });
  }

  printConflicts();
}

async function main() {
  if (fs.existsSync('./pnpm-lock.yaml')) {
    await checkPnpmLock();
  } else {
    console.error('No pnpm-lock.yaml found in current directory.');
    process.exit(1);
  }
}

await main();

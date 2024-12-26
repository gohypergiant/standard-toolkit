import * as fs from 'node:fs';
import * as path from 'node:path';

import { getPaths } from './get-paths.mjs';
import tsconfig from '../tsconfig.json' with { type: 'json' };

/**
 * This file is meant to be a CLI utility for auditing the content in the tsconfig file
 * ensuring the inclusion of the the appropriate packages. Optionally - using the
 * CLI argument `--addMissing` - the missing includes could be added in a batch rather
 * than requiring manual work.
 *
 * @example
 * node ./apps/docs/lib/audit-tsconfig.mjs
 * // will list missing includes if any are/aren't found to be where expected
 * // will print "All expected includes exist." if all expected includes exist
 *
 * @example
 * node ./apps/docs/lib/audit-tsconfig.mjs --addMissing
 * // will create add missing includes to tsconfig.json
 */

const PACKAGES_DIR = path.join(process.cwd(), 'packages');
const TSCONFIG_DIR = path.resolve(
  path.join(import.meta.dirname, '../tsconfig.json'),
);

const addMissing = process.argv.includes('--addMissing');
const getMissing = () =>
  getPaths(PACKAGES_DIR, undefined, 0)
    .flat()
    .filter(
      (expected) => !tsconfig.include.find((inc) => inc.endsWith(expected)),
    );

let missing = getMissing();

if (missing.length && addMissing) {
  console.log(`Adding missing (${missing.length}) modules...`);

  for (const part of missing) {
    tsconfig.include.push(`../../packages${part}`);
  }

  tsconfig.include.sort();

  fs.writeFileSync(TSCONFIG_DIR, JSON.stringify(tsconfig, null, 2));
}

missing = getMissing();

if (missing.length) {
  console.log('Missing the following "includes" in tsconfig.json:', missing);
} else {
  console.log('All modules included in tsconfig.json');
}

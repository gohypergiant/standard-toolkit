import * as fs from 'node:fs';
import * as path from 'node:path';

import { getPaths } from './get-paths.mjs';

/**
 * This file is meant to be a CLI utility for auditing the content in the documentation
 * site reporting on the existence of the bare minimum of pages. Optionally - using the
 * CLI argument `--stubMissing` - the missing pages could be created in a batch rather
 * than requiring manual work.
 *
 * @example
 * node ./apps/docs/lib/audit-modules.mjs
 * // will list missing documentation pages if any are/aren't found to be where expected
 * // will print "All expected files exist." if all expected documentation pages exist
 *
 * @example
 * node ./apps/docs/lib/audit-modules.mjs
 * // will create "stub" files for missing documentation pages; ready for editing
 */

const addMissingDocuments = process.argv.includes('--stubMissing');
const pagesLocation = path.join(
  process.cwd(),
  'apps',
  'docs',
  'src',
  'packages',
);
const pages = getPaths(
  path.join(process.cwd(), 'packages'),
  undefined,
  1,
).flat();

let cleanAudit = true;

for (const page of pages) {
  const name = path.join(pagesLocation, page);
  const md = `${name}.md`;
  const mdx = `${name}.mdx`;

  const exists = () => fs.existsSync(md) || fs.existsSync(mdx);

  if (!exists() && addMissingDocuments) {
    // Ensure the directory exists before writing the file
    fs.mkdirSync(path.dirname(md), { recursive: true });

    // Write the initial file content
    fs.writeFileSync(md, `# ${page}\n`, 'utf8');
  }

  if (!exists()) {
    cleanAudit = false;
    console.log(`Missing page: .${md.replace(process.cwd(), '')}(x)`);
  }
}

if (cleanAudit) {
  console.log('All expected files exist.');
}

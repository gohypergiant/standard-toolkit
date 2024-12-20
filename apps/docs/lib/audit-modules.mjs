import * as fs from 'node:fs';
import * as path from 'node:path';

import { getPaths } from './get-paths.mjs';

const ARG_STUB_MISSING = process.argv.includes('--stubMissing');

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

for (const page of pages) {
  const name = path.join(pagesLocation, page);
  const md = `${name}.md`;
  const mdx = `${name}.mdx`;

  const exists = fs.existsSync(md) || fs.existsSync(mdx);

  if (!exists && ARG_STUB_MISSING) {
    // fs.writefileSync(md, `# ${page}`, 'utf8');
  }

  if (!exists) {
    console.log(`Missing page: .${md.replace(process.cwd(), '')}(x)`);
  }
}

// console.log(JSON.stringify(pages, null, 4));

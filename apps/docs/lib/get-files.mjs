import fs from 'node:fs';
import path from 'node:path';

import { PATTERN_EXCLUDE } from './exclude.mjs';

export const getFiles = (dir, root = dir) => Array.from(getFilesGen(dir, root));

function* getFilesGen(dir, root) {
  for (const fileName of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, fileName);

    if (!PATTERN_EXCLUDE.test(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        yield* getFiles(filePath, root);
      } else if (/\.[jt]s[x]?$/.test(filePath) && hasDocBlock(filePath)) {
        yield filePath;
      }
    }
  }
}

function hasDocBlock(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');

  return /\/\*\*/.test(contents);
}

import * as fs from 'node:fs';
import * as path from 'node:path';

import { PATTERN_EXCLUDE } from './exclude.mjs';

/**
 * Recursively gather the filesystem directories (folders) into an array of strings
 * filtering out specific entries as they aren't necessary for the intended use case.
 *
 * @param dir the starting point to read from
 * @param root the top-most level of the recursion; used to trim full path
 * @param depth how deep of a structure to return back
 * @returns a string array of directories
 */
export const getPaths = (dir, root = dir, depth = 3) =>
  Array.from(getPathsGen(dir, root, depth));

function* getPathsGen(dir, root, depth) {
  for (const fileName of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, fileName);

    if (
      fs.statSync(filePath).isDirectory() &&
      !PATTERN_EXCLUDE.test(filePath)
    ) {
      const current = filePath.replace(root, '').replace('/src', '');
      const next = () => getPaths(filePath, root, depth - 1);

      yield* filePath.endsWith('src')
        ? next()
        : depth < 1
          ? [current]
          : [current, next()].filter((item) => item.length);
    }
  }
}

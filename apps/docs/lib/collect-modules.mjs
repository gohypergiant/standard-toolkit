import * as fs from 'node:fs';
import * as path from 'node:path';

const PATTERN_EXCLUDE =
  /__fixtures__|coverage|dist|documentation|ladle|node_modules|styles|test|types|\.(?:bench|config|css|d|ladle|stories|test|turbo)/;

const getPaths = (dir, root = dir, depth = 3) =>
  Array.from(getPathsGen(dir, root, depth));

// sourced from: https://exploringjs.com/impatient-js/ch_sync-generators.html#reusing-traversals
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

const tree = getPaths(
  path.join(process.cwd(), 'packages'),
  undefined,
  2,
).flat();

// run: node ./apps/docs/lib/collect-modules.mjs
console.log(JSON.stringify(tree, null, 4));

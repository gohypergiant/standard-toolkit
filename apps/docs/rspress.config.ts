import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  // // biome-ignore lint/style/useNamingConvention: not my choice of naming
  // globalUIComponents: [path.join(__dirname, 'components', 'playground.tsx')],
  markdown: {
    // globalComponents: [path.join(__dirname, 'components', 'playground.tsx')],
    mdxRs: false,
    showLineNumbers: true,
  },
  root: path.join(__dirname, 'docs'),
  title: 'DevTK',
});

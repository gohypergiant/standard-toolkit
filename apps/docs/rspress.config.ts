import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  markdown: {
    mdxRs: false,
    showLineNumbers: true,
  },
  root: path.join(__dirname, 'docs'),
  title: 'DevTK',
});

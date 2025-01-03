import * as path from 'node:path';

import { pluginPlayground } from '@rspress/plugin-playground';
import { defineConfig } from 'rspress/config';

// import customInstallBlock from './lib/plugin-remark-custom-install.ts';

export default defineConfig({
  markdown: {
    // TODO: figure out if we can change the markdown before it is processed into rendered react components
    // ... this solution seems to have been executed after that occurred; this would require more integration
    // with AST generation of tree nodes in the processing pipeline of RSPress
    // remarkPlugins: [
    //   [
    //     customInstallBlock,
    //     // { foo: 1 }, // config options
    //   ],
    // ],
    showLineNumbers: true,
  },
  plugins: [
    pluginPlayground({
      defaultDirection: 'vertical',
      defaultRenderMode: 'pure', // or 'playground'
    }),
  ],
  outDir: path.join(__dirname, 'dist'),
  root: path.join(__dirname, 'src'),
  title: 'DevTK',
});

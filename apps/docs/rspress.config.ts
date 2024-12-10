import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  // // biome-ignore lint/style/useNamingConvention: not my choice of naming
  // globalUIComponents: [path.join(__dirname, 'components', 'playground.tsx')],
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  root: path.join(__dirname, 'docs'),
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
  },
  title: 'My Site',
});

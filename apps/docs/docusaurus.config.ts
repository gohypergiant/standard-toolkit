/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Development Toolkit (DevTK)',
  tagline:
    'A "standard library" for web applications in the Accelint family of systems.',
  favicon: 'img/favicon.ico',

  url: 'https://standard-toolkit-next.vercel.app',
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'gohypergiant',
  projectName: 'standard-toolkit',

  // TODO: change "ignore" to "warn" or "error" when the site is more complete.
  // "ignore" for now to make the output during build less noisy.
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',
  onBrokenAnchors: 'ignore',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          breadcrumbs: false,
          path: './content',
          rehypePlugins: [rehypeKatex],
          remarkPlugins: [remarkMath],
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Add this to enable the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/banner.jpg',
    navbar: {
      title: 'Development Toolkit (DevTK)',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'demoSidebar',
        //   position: 'left',
        //   label: 'Demo',
        // },
        {
          href: 'https://github.com/gohypergiant/standard-toolkit',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/gohypergiant/standard-toolkit',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hypergiant Galactic Systems Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    '@docusaurus/theme-live-codeblock',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;

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

import { withThemeByClassName } from '@storybook/addon-themes';
import { DocsContainer } from '@storybook/blocks';
import type { Preview, ReactRenderer } from '@storybook/react';
import { themes } from '@storybook/theming';
import { createElement } from 'react';
import { Docs } from './docs';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    docs: {
      container: (props: any) => {
        const el = document.querySelector('html');
        const sbTheme = props?.context.store.userGlobals.globals.theme;
        const theme = sbTheme === 'dark' ? themes.dark : themes.light;
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        el!.dataset.theme = sbTheme;
        const newProps = { ...props, theme };
        return createElement(DocsContainer, newProps);
      },
      page: Docs,
      story: {
        inline: true, // withThemesByClassName applies in docs too
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'light',
          value: 'bg-surface-default',
        },
        {
          name: 'dark',
          value: 'bg-surface-default',
        },
      ],
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Foundation', 'Layout', 'Components'],
        locales: 'en-US',
      },
    },
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: 'light !bg-surface-default', // need important because storybook uses important 🫠
        dark: 'dark !bg-surface-default', // need important because storybook uses important 🫠
      },
      defaultTheme: 'dark',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;

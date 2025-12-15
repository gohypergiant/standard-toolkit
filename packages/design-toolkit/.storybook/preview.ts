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

import { DocsContainer } from '@storybook/addon-docs/blocks';
import { withThemeByClassName } from '@storybook/addon-themes';
import { createElement } from 'react';
import { type ThemeVars, themes } from 'storybook/theming';
import { Docs } from './docs';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import '@accelint/design-foundation/styles';
import '../src/index.module.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    disableSaveFromUI: true,
    docs: {
      // biome-ignore lint/suspicious/noExplicitAny: this is the sb type
      container: (props: any) => {
        const rootEl = document.querySelector('html');
        const sbTheme = props?.context.store.userGlobals.globals.theme;

        let theme: ThemeVars;
        if (sbTheme === 'light') {
          theme = themes.light;
          rootEl?.classList.remove('dark');
          rootEl?.classList.add('light');
        } else {
          theme = themes.dark;
          rootEl?.classList.remove('light');
          rootEl?.classList.add('dark');
        }

        const newProps = { ...props, theme };
        return createElement(DocsContainer, newProps);
      },
      page: Docs,
      story: {
        inline: true, // withThemesByClassName applies in docs too
      },
      codePanel: true,
    },
    layout: 'centered',
    backgrounds: {
      disabled: true,
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

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
import { type ThemeVars, themes } from '@storybook/theming';
import { createElement } from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import './index.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
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
      story: {
        inline: true, // withThemeByClassName applies in docs too
      },
    },
    backgrounds: {
      disable: true, // prevent conflict w/ addon-themes
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
};

export default preview;

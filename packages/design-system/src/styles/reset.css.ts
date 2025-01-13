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

import { globalStyle } from '@vanilla-extract/css';
import { layers } from './layers.css';
import { focusOutlineStyle, typographyVars } from './theme.css';

globalStyle('*', {
  '@layer': {
    [layers.reset]: {
      margin: 0,
    },
  },
});

globalStyle('*, *::before, *::after', {
  '@layer': {
    [layers.reset]: {
      boxSizing: 'border-box',
    },
  },
});

globalStyle(':focus-visible', {
  '@layer': {
    [layers.reset]: focusOutlineStyle,
  },
});

globalStyle('body', {
  '@layer': {
    [layers.reset]: {
      // biome-ignore lint/style/useNamingConvention: This property needs to be PascalCase
      WebkitFontSmoothing: 'antialiased',
      fontFamily: typographyVars.sans,
    },
  },
});

globalStyle('img, picture, video, canvas, svg', {
  '@layer': {
    [layers.reset]: {
      display: 'block',
    },
  },
});

globalStyle('input, button, textarea, select', {
  '@layer': {
    [layers.reset]: {
      font: 'inherit',
      letterSpacing: 'inherit',
    },
  },
});

globalStyle('h1, h2, h3, h4, h5, h6, p', {
  '@layer': {
    [layers.reset]: {
      overflowWrap: 'break-word',
    },
  },
});

globalStyle('code', {
  '@layer': {
    [layers.reset]: {
      fontFamily: typographyVars.mono,
    },
  },
});

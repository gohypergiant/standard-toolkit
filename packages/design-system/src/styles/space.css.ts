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
import { spaceVars } from './theme.css';

globalStyle('h1, h2, h3, h4, h5, h6', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.heading,
    },
  },
});

globalStyle('p', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.paragraph,
    },
  },
});

globalStyle('ol, ul', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.list.group,
    },
  },
});

globalStyle('li', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.list.item,
    },
  },
});

globalStyle(':last-child', {
  '@layer': {
    [layers.styles]: {
      marginBottom: spaceVars.lastChild,
    },
  },
});

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

import template from './src/template.js';

/**
 * SVGO preset list contains the following optimizations: https://svgo.dev/docs/preset-default/#plugins-list
 */
export default {
  expandProps: true,
  filenameCase: 'kebab',
  icon: 24,
  jsxRuntime: 'automatic',
  outDir: 'src/icons',
  replaceAttrValues: {
    '#898989': 'currentColor',
  },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      {
        name: 'removeUnknownsAndDefaults',
        params: {
          unknownContent: true,
          unknownAttrs: true,
          defaultAttrs: false,
          defaultMarkupDeclarations: true,
          uselessOverrides: true,
          keepDataAttrs: true,
          keepAriaAttrs: true,
          keepRoleAttr: false,
        },
      },
    ],
  },
  svgProps: {
    fill: 'none',
    viewBox: '0 0 24 24',
  },
  dimensions: false,
  template: template,
  titleProp: true,
  typescript: true,
};

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

/** @type {Partial<import("typedoc").TypeDocOptions>} */
export default {
  customCss: './custom.css',
  disableSources: true,
  entryPoints: ['../../packages/*'],
  entryPointStrategy: 'packages',
  githubPages: false, // false === do not emit the file `.nojekyll`
  name: 'Accelint Standard Toolkit (DevTK)',
  navigationLinks: {
    // biome-ignore lint/style/useNamingConvention: proper capitalization
    GitHub: 'https://github.com/gohypergiant/standard-toolkit',
  },
  out: 'dist/',
  packageOptions: {
    entryPoints: ['src/index.ts'],
    projectDocuments: ['src/**/*.md'],
  },
};

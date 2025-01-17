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

import { OptionDefaults } from 'typedoc';

/** @type {Partial<import("typedoc").TypeDocOptions>} */
export default {
  disableSources: true,
  entryPoints: ['../../packages/*'],
  entryPointStrategy: 'packages',
  hideBreadcrumbs: true,
  hidePageHeader: true,
  mergeReadme: true,
  out: 'content/api',
  packageOptions: {
    entryPoints: ['src/index.ts'],
    groupOrder: ['Functions', 'Variables', 'Type Aliases', '*'],
    projectDocuments: ['src/documentation/**/*.md'], // open to other patterns here
    blockTags: [...OptionDefaults.blockTags, '@playground'], // https://typedoc.org/documents/Options.Comments.html#blocktags
  },
  pageTitleTemplates: {
    member: (args) => args.name, // simpler page titles for member pages
  },
  plugin: [
    'typedoc-plugin-markdown',
    './lib/typedoc-plugin-hypergiant.mjs',
    './lib/typedoc-plugin-playground.mjs',
  ],
  requiredToBeDocumented: ['Class', 'Function', 'Interface'],
  theme: 'markdown',
};

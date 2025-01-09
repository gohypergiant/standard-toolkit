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
const config = {
  disableSources: true,
  entryPoints: ['../../packages/*'],
  entryPointStrategy: 'packages',
  githubPages: false,
  hideBreadcrumbs: true,
  hidePageHeader: true,
  mergeReadme: true,
  out: 'docs/typedoc',
  packageOptions: {
    entryPoints: ['src/index.ts'],
    groupOrder: ['Functions', 'Variables', 'Type Aliases', '*'],
    projectDocuments: ['src/documentation/**/*.md'], // open to other patterns here
  },
  pageTitleTemplates: {
    member: (args) => args.name, // simpler page titles for member pages
  },
  plugin: ['typedoc-plugin-markdown'],
  readme: 'none', // don't bring in global monorepo readme
  requiredToBeDocumented: ['Class', 'Function', 'Interface'],
  theme: 'markdown',
};

export default config;

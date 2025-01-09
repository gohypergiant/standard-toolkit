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
  // outputFileStrategy: 'modules', a flatter option. works well for smaller modules IMO
  githubPages: false,
  hideBreadcrumbs: true,
  hidePageHeader: true,
  pageTitleTemplates: {
    member: (args) => args.name, // simpler page titles for member pages
  },
  out: 'docs/typedoc',
  packageOptions: {
    entryPoints: ['src/index.ts'],
    groupOrder: ['Functions', 'Variables', 'Type Aliases', '*'],
    projectDocuments: ['src/**/*.md'],
  },
  mergeReadme: true,
  readme: 'none', // don't bring in global monorepo readme
  theme: 'markdown',
  plugin: ['typedoc-plugin-markdown'],
  requiredToBeDocumented: ['Class', 'Function', 'Interface'],
};

export default config;

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

import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

// some files output by TypeDoc are not in the correct location for Docusaurus
// to link them correctly; moving the files is handled by the npm script
function fixLink(page, from, to) {
  if (page.contents.includes(from)) {
    page.contents = page.contents.replace(from, to);
  }
}

/**
 * TypeDoc plugin that customizes the behavior of TypeDoc for our purposes.
 * There may be more than one customization in this file and there may be
 * additional plugin files for TypeDoc depending on the complexity of the
 * needed customization.
 *
 * @param {import('typedoc').Application} app
 *
 * @remarks
 * pure: no; event handlers are registered on the app
 * idempotent: yes
 */
export function load(app) {
  app.renderer.off(MarkdownPageEvent.END, renderMarkdown);
  app.renderer.on(MarkdownPageEvent.END, renderMarkdown);
}

/**
 * @param {import('typedoc').PageEvent<Reflection>} page
 *
 * @remarks
 * pure: no; mutates page.contents
 * idempotent: no; will add the slug to the page.contents each time it is called
 */
function renderMarkdown(page) {
  if (page.url === 'README.md') {
    // the slug is used by Docusaurus to determine the URL of the page
    // in combination with `routeBasePath: '/'` in docusaurus.config.js
    // makes the README the index - landing page - page of the site
    page.contents = `---\nslug: /\n---\n\n${page.contents}`;
  }

  fixLink(page, '_media/CONTRIBUTING.md', 'CONTRIBUTING');
  fixLink(page, '_media/LICENSE', 'LICENSE');
}

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

const HEADER = `Copyright ${new Date().getFullYear()} Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.`;

const JS_COMMENT_STYLE = {
  start: '/*\n * ',
  middle: ' * ',
  end: '\n */\n',
};

const HTML_COMMENT_STYLE = {
  start: '<!-- ',
  middle: '',
  end: ' -->\n',
};

export const COMMENT_STYLES = {
  '.js': JS_COMMENT_STYLE,
  '.ts': JS_COMMENT_STYLE,
  '.mts': JS_COMMENT_STYLE,
  '.tsx': JS_COMMENT_STYLE,
  '.jsx': JS_COMMENT_STYLE,
  '.mjs': JS_COMMENT_STYLE,
  '.css': JS_COMMENT_STYLE,
  '.md': HTML_COMMENT_STYLE,
  '.mdx': HTML_COMMENT_STYLE,
};

export function getFormattedHeader(fileExtension) {
  const style = COMMENT_STYLES[fileExtension];
  return `${style.start}${HEADER.split('\n').join(`\n${style.middle}`)}${style.end}`.replace(
    /\s+\n/g,
    '\n',
  );
}

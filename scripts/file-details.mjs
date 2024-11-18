/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { parseFileSync } from '@swc/core';
import { fs } from 'zx';

import { pragmaParser } from './pragma-parser.mjs';

const SWC_OPTIONS = {
  syntax: 'typescript',
  target: 'es2022',
};

/** Collect the exported members' names. */
function exportsReducer(acc, member) {
  if (member.type === 'ExportDeclaration') {
    if (member.declaration.declarations) {
      // const, let, var allow for comma separated values
      for (const inner of member.declaration.declarations) {
        acc.push(inner.id.value);
      }
    } else {
      acc.push(
        member.declaration?.identifier?.value || member.declaration?.id?.value,
      );
    }
  }

  return acc;
}

/**
 * Get the source code of the file and the exported members; taking into
 * consideration the pragmas that affect what members will be available in the
 * public API:
 *
 * - `__private-exports`
 * - `export-ignore`
 * - `export-ignore [x, y, z]`
 * - `export-only [a, b, c]`
 *
 * @returns [string, string[]] // [source, exports]
 */
export function getFileDetails(path, options = {}) {
  const ast = parseFileSync(path, {
    ...SWC_OPTIONS,
    ...options,
  });
  const source = fs.readFileSync(path, 'utf8');

  const exports = ast.body.reduce(exportsReducer, []);
  const [pragma, ...list] = pragmaParser(source);

  const result = [source];

  switch (pragma) {
    case 'ignore':
      result.push(
        list[0] === '*' ? [] : exports.filter((name) => !list.includes(name)),
      );
      break;
    case 'only':
      result.push(exports.filter((name) => list.includes(name)));
      break;
    default:
      result.push(exports);
      break;
  }

  return result;
}

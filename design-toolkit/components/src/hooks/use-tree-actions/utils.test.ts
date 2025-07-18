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

import { describe, expect, it } from 'vitest';
import { toTree } from './utils';

describe('hooks/use-tree-actions/utils', () => {
  it('builds a tree from a treeRef', () => {
    const roots = ['one'];
    const lookup = new Map([
      [
        'one',
        {
          key: 'one',
          label: 'One',
          parentKey: null,
          children: [
            { key: 'two', label: 'Two', parentKey: 'one' },
            { key: 'three', label: 'Three', parentKey: 'one' },
          ],
        },
      ],
      ['two', { key: 'two', label: 'Two', parentKey: 'one' }],
      ['three', { key: 'three', label: 'Three', parentKey: 'one' }],
    ]);

    expect(toTree({ roots, lookup })).toStrictEqual([
      {
        key: 'one',
        parentKey: null,
        label: 'One',
        children: [
          {
            key: 'two',
            parentKey: 'one',
            label: 'Two',
            children: [],
          },
          {
            key: 'three',
            parentKey: 'one',
            label: 'Three',
            children: [],
          },
        ],
      },
    ]);
  });
});

// __private-exports
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

import type { TreeNode } from '../../types';

export type Values = {
  test?: string;
  isTrue?: boolean;
};

export const nodeDefaults = {
  parentKey: null,
  children: [],
  isDisabled: false,
  isExpanded: false,
  isSelected: false,
  isVisible: false,
  isVisibleComputed: false,
};

export const defaultTree: TreeNode<Values>[] = [
  {
    ...nodeDefaults,
    key: 'one',
    label: 'One',
    children: [
      {
        ...nodeDefaults,
        key: 'two',
        parentKey: 'one',
        label: 'Two',
      },
      {
        ...nodeDefaults,
        key: 'three',
        parentKey: 'one',
        label: 'Three',
      },
    ],
  },
];

// Helper to create a more complex tree for testing moveNodes
export const complexTree = [
  {
    ...nodeDefaults,
    key: 'root1',
    label: 'Root 1',
    children: [
      {
        ...nodeDefaults,
        key: 'child1',
        parentKey: 'root1',
        label: 'Child 1',
      },
      {
        ...nodeDefaults,
        key: 'child2',
        parentKey: 'root1',
        label: 'Child 2',
      },
      {
        ...nodeDefaults,
        key: 'child3',
        parentKey: 'root1',
        label: 'Child 3',
      },
    ],
  },
  {
    ...nodeDefaults,
    key: 'root2',
    label: 'Root 2',
    children: [
      {
        ...nodeDefaults,
        key: 'child4',
        parentKey: 'root2',
        label: 'Child 4',
      },
      {
        ...nodeDefaults,
        key: 'child5',
        parentKey: 'root2',
        label: 'Child 5',
      },
    ],
  },
];

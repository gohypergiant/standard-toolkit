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

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTreeActions } from './';
import { defaultTree, nodeDefaults, type Values } from './__fixtures__/cache';
import type { UseTreeActionsOptions } from '../types';

function setup({ nodes }: UseTreeActionsOptions<Values>) {
  const options = {};

  return {
    ...renderHook((overrides: Partial<UseTreeActionsOptions<Values>>) =>
      useTreeActions<Values>({ nodes, ...overrides }),
    ),
    options,
  };
}

describe('useTreeActions', () => {
  describe('get node', () => {
    it('returns a node', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(hook.current.getNode('two')).toStrictEqual({
        ...nodeDefaults,
        key: 'two',
        parentKey: 'one',
        label: 'Two',
      });
    });

    it('returns a node with children', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(hook.current.getNode('one')).toStrictEqual({
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
      });
    });

    it('returns a node with all descendants', () => {
      const { result: hook } = setup({
        nodes: [
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
                children: [
                  {
                    ...nodeDefaults,
                    key: 'four',
                    parentKey: 'two',
                    label: 'Four',
                  },
                ],
              },
              {
                ...nodeDefaults,
                key: 'three',
                parentKey: 'one',
                label: 'Three',
              },
            ],
          },
        ],
      });

      expect(hook.current.getNode('one')).toStrictEqual({
        ...nodeDefaults,
        key: 'one',
        label: 'One',
        children: [
          {
            ...nodeDefaults,
            key: 'two',
            parentKey: 'one',
            label: 'Two',
            children: [
              {
                ...nodeDefaults,
                key: 'four',
                parentKey: 'two',
                label: 'Four',
              },
            ],
          },
          {
            ...nodeDefaults,
            key: 'three',
            parentKey: 'one',
            label: 'Three',
          },
        ],
      });
    });
  });

  /** ADD NODES **/
  describe('insert actions', () => {
    it('should insert a single node at root start', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(
        hook.current.insertBefore(null, [
          {
            key: 'four',
            label: 'Four',
          },
        ]),
      ).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'four',
          parentKey: null,
          label: 'Four',
        },
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
      ]);
    });

    it('should insert a single node at root end', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(
        hook.current.insertAfter(null, [
          {
            key: 'four',
            label: 'Four',
          },
        ]),
      ).toStrictEqual([
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
        {
          ...nodeDefaults,
          key: 'four',
          parentKey: null,
          label: 'Four',
        },
      ]);
    });

    it('should insert a node before the target', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(
        hook.current.insertBefore('two', [
          {
            key: 'four',
            label: 'Four',
          },
        ]),
      ).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          children: [
            {
              ...nodeDefaults,
              key: 'four',
              parentKey: 'one',
              label: 'Four',
            },
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
      ]);
    });

    it('should insert a node after the target', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(
        hook.current.insertAfter('two', [
          {
            key: 'four',
            label: 'Four',
          },
        ]),
      ).toStrictEqual([
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
              key: 'four',
              parentKey: 'one',
              label: 'Four',
            },
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
            },
          ],
        },
      ]);
    });

    it('should insert under a parent', () => {
      const { result: hook } = setup({ nodes: defaultTree });
      expect(
        hook.current.insertInto('two', [
          {
            key: 'four',
            label: 'Four',
          },
        ]),
      ).toStrictEqual([
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
              children: [
                {
                  ...nodeDefaults,
                  key: 'four',
                  parentKey: 'two',
                  label: 'Four',
                },
              ],
            },
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
            },
          ],
        },
      ]);
    });
  });

  /** REMOVE NODES **/
  describe('remove actions', () => {
    it('should remove a root node and descendants', () => {
      const { result: hook } = setup({
        nodes: [
          {
            ...nodeDefaults,
            key: 'one',
            parentKey: null,
            label: 'One',
            children: [
              {
                ...nodeDefaults,
                key: 'two',
                parentKey: 'one',
                label: 'Two',
                children: [
                  {
                    ...nodeDefaults,
                    key: 'four',
                    parentKey: 'two',
                    label: 'Four',
                  },
                ],
              },
            ],
          },
          {
            ...nodeDefaults,
            key: 'three',
            parentKey: null,
            label: 'Three',
          },
        ],
      });

      expect(hook.current.remove(new Set(['one']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
        },
      ]);
    });

    it('should remove a single node', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(hook.current.remove(new Set(['two']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          children: [
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
            },
          ],
        },
      ]);
    });
  });

  /** UPDATE NODE **/
  describe('update actions', () => {
    it('should update a node by key', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      const update = hook.current.updateNode('one', (node) => ({
        ...node,
        label: 'Updated One',
      }));

      expect(update).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          parentKey: null,
          label: 'Updated One',
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
      ]);
    });
  });

  /** MOVE NODES **/
  describe('move actions', () => {
    it('should move a node to root start', () => {
      const { result: hook } = setup({ nodes: defaultTree });
      expect(hook.current.moveBefore(null, new Set(['three']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
        },
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
          ],
        },
      ]);
    });

    it('should move a node to root end', () => {
      const { result: hook } = setup({ nodes: defaultTree });
      expect(hook.current.moveAfter(null, new Set(['three']))).toStrictEqual([
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
          ],
        },
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
        },
      ]);
    });

    it('should move between root nodes', () => {
      const { result: hook } = setup({
        nodes: [
          {
            ...nodeDefaults,
            key: 'one',
            label: 'One',
            children: [],
          },
          {
            ...nodeDefaults,
            key: 'two',
            parentKey: null,
            label: 'Two',
          },
          {
            ...nodeDefaults,
            key: 'three',
            parentKey: null,
            label: 'Three',
          },
        ],
      });
      expect(hook.current.moveBefore('two', new Set(['three']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          children: [],
        },
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
        },
        {
          ...nodeDefaults,
          key: 'two',
          parentKey: null,
          label: 'Two',
        },
      ]);
    });

    it('should move a node before target in same parent', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(hook.current.moveBefore('two', new Set(['three']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          children: [
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
            },
            {
              ...nodeDefaults,
              key: 'two',
              parentKey: 'one',
              label: 'Two',
            },
          ],
        },
      ]);
    });

    it('should move a node before target in another parent', () => {
      const { result: hook } = setup({
        nodes: [
          {
            ...nodeDefaults,
            key: 'one',
            parentKey: null,
            label: 'One',
            children: [
              {
                ...nodeDefaults,
                key: 'two',
                parentKey: 'one',
                label: 'Two',
              },
            ],
          },
          {
            ...nodeDefaults,
            key: 'three',
            parentKey: null,
            label: 'Three',
            children: [
              {
                ...nodeDefaults,
                key: 'four',
                parentKey: 'three',
                label: 'Four',
              },
            ],
          },
        ],
      });

      expect(hook.current.moveBefore('two', new Set(['four']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          parentKey: null,
          label: 'One',
          children: [
            {
              ...nodeDefaults,
              key: 'four',
              parentKey: 'one',
              label: 'Four',
            },
            {
              ...nodeDefaults,
              key: 'two',
              parentKey: 'one',
              label: 'Two',
            },
          ],
        },
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
          children: [],
        },
      ]);
    });

    it('should move a node after target in same parent', () => {
      const { result: hook } = setup({
        nodes: [
          {
            ...nodeDefaults,
            key: 'one',
            parentKey: null,
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
              {
                ...nodeDefaults,
                key: 'four',
                parentKey: 'one',
                label: 'Four',
              },
            ],
          },
        ],
      });

      expect(hook.current.moveAfter('four', new Set(['two']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          parentKey: null,
          label: 'One',
          children: [
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
            },
            {
              ...nodeDefaults,
              key: 'four',
              parentKey: 'one',
              label: 'Four',
            },
            {
              ...nodeDefaults,
              key: 'two',
              parentKey: 'one',
              label: 'Two',
            },
          ],
        },
      ]);
    });

    it('should move a node after target in another parent', () => {
      const { result: hook } = setup({
        nodes: [
          {
            ...nodeDefaults,
            key: 'one',
            parentKey: null,
            label: 'One',
            children: [
              {
                ...nodeDefaults,
                key: 'two',
                parentKey: 'one',
                label: 'Two',
              },
            ],
          },
          {
            ...nodeDefaults,
            key: 'three',
            parentKey: null,
            label: 'Three',
            children: [
              {
                ...nodeDefaults,
                key: 'four',
                parentKey: 'three',
                label: 'Four',
              },
            ],
          },
        ],
      });

      expect(hook.current.moveAfter('two', new Set(['four']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          parentKey: null,
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
              key: 'four',
              parentKey: 'one',
              label: 'Four',
            },
          ],
        },
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
          children: [],
        },
      ]);
    });
  });

  /** SELECTION **/
  describe('selection actions', () => {
    it('should remove selection if not in set', () => {
      const { result: hook } = setup({
        nodes: [
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
                isSelected: true,
              },
              {
                ...nodeDefaults,
                key: 'three',
                parentKey: 'one',
                label: 'Three',
                isSelected: true,
              },
            ],
          },
        ],
      });

      expect(hook.current.onSelectionChange(new Set(['two']))).toStrictEqual([
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
              isSelected: true,
            },
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
              isSelected: false,
            },
          ],
        },
      ]);
    });

    it('should add selection if in set', () => {
      const { result: hook } = setup({
        nodes: [
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
                isSelected: true,
              },
              {
                ...nodeDefaults,
                key: 'three',
                parentKey: 'one',
                label: 'Three',
              },
            ],
          },
        ],
      });

      expect(
        hook.current.onSelectionChange(new Set(['two', 'three'])),
      ).toStrictEqual([
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
              isSelected: true,
            },
            {
              ...nodeDefaults,
              key: 'three',
              parentKey: 'one',
              label: 'Three',
              isSelected: true,
            },
          ],
        },
      ]);
    });
  });

  /** EXPANSION **/
  describe('expansion actions', () => {
    it('should collapse if not in set', () => {
      const { result: hook } = setup({
        nodes: [
          {
            ...nodeDefaults,
            key: 'one',
            label: 'One',
            isExpanded: true,
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
        ],
      });

      expect(hook.current.onExpandedChange(new Set())).toStrictEqual([
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
      ]);
    });

    it('should expand if in set', () => {
      const { result: hook } = setup({ nodes: defaultTree });

      expect(hook.current.onExpandedChange(new Set(['one']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          isExpanded: true,
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
      ]);
    });
  });

  /** VISIBILITY **/
  describe('visibility actions', () => {
    it('should compute root visibility change', () => {
      const { result: hook } = setup({
        nodes: [
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
                children: [
                  {
                    ...nodeDefaults,
                    key: 'three',
                    parentKey: 'two',
                    label: 'Three',
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(hook.current.onVisibilityChange(new Set(['one']))).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          isVisible: true,
          isVisibleComputed: true,
          children: [
            {
              ...nodeDefaults,
              key: 'two',
              parentKey: 'one',
              label: 'Two',
              isVisible: false,
              isVisibleComputed: false,
              children: [
                {
                  ...nodeDefaults,
                  key: 'three',
                  parentKey: 'two',
                  label: 'Three',
                  isVisible: false,
                  isVisibleComputed: false,
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should compute children visibility', () => {
      const { result: hook } = setup({
        nodes: [
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
                children: [
                  {
                    ...nodeDefaults,
                    key: 'three',
                    parentKey: 'two',
                    label: 'Three',
                  },
                ],
              },
            ],
          },
        ],
      });

      // change grandparent on
      expect(
        hook.current.onVisibilityChange(new Set(['one', 'two'])),
      ).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          isVisible: true,
          isVisibleComputed: true,
          children: [
            {
              ...nodeDefaults,
              key: 'two',
              parentKey: 'one',
              label: 'Two',
              isVisible: true,
              isVisibleComputed: true,
              children: [
                {
                  ...nodeDefaults,
                  key: 'three',
                  parentKey: 'two',
                  label: 'Three',
                  isVisible: false,
                  isVisibleComputed: false,
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should compute children visibility', () => {
      const { result: hook } = setup({
        nodes: [
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
                children: [
                  {
                    ...nodeDefaults,
                    key: 'three',
                    parentKey: 'two',
                    label: 'Three',
                  },
                ],
              },
            ],
          },
        ],
      });

      // change grandparent on
      expect(
        hook.current.onVisibilityChange(new Set(['one', 'three'])),
      ).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'one',
          label: 'One',
          isVisible: true,
          isVisibleComputed: true,
          children: [
            {
              ...nodeDefaults,
              key: 'two',
              parentKey: 'one',
              label: 'Two',
              isVisible: false,
              isVisibleComputed: false,
              children: [
                {
                  ...nodeDefaults,
                  key: 'three',
                  parentKey: 'two',
                  label: 'Three',
                  isVisible: true,
                  isVisibleComputed: false,
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});

// // change parent on
// expect(hook.current.onVisibilityChange(new Set([]))).toStrictEqual(
//   visibilityTree,
// );
// // change parent off
// expect(hook.current.onVisibilityChange(new Set([]))).toStrictEqual(
//   visibilityTree,
// );
// // change grandchild on
// expect(hook.current.onVisibilityChange(new Set([]))).toStrictEqual(
//   visibilityTree,
// );
// // change grandchild off
// expect(hook.current.onVisibilityChange(new Set([]))).toStrictEqual(
//   visibilityTree,
// );

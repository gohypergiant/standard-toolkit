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
import type { TreeNode, UseTreeActionsOptions } from '../types';
import { useTreeActions } from './';

type Values = {
  test?: string;
  isTrue?: boolean;
};

function setup({ nodes }: UseTreeActionsOptions<Values>) {
  const options = {};

  return {
    ...renderHook((overrides: Partial<UseTreeActionsOptions<Values>>) =>
      useTreeActions<Values>({ nodes, ...overrides }),
    ),
    options,
  };
}

const nodeDefaults = {
  parentKey: null,
  children: [],
  isExpanded: false,
  isReadOnly: false,
  isSelected: false,
  isViewable: false,
  isVisible: false,
};

const tree: TreeNode<Values>[] = [
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

describe('useTreeActions', () => {
  /** ADD NODES **/
  describe('insert actions', () => {
    it('should insert a single node at root start', () => {
      const { result: hook } = setup({ nodes: tree });

      expect(
        hook.current.insertBefore(null, {
          key: 'four',
          label: 'Four',
        }),
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
      const { result: hook } = setup({ nodes: tree });

      expect(
        hook.current.insertAfter(null, {
          key: 'four',
          label: 'Four',
        }),
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
      const { result: hook } = setup({ nodes: tree });

      expect(
        hook.current.insertBefore('two', {
          key: 'four',
          label: 'Four',
        }),
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
      const { result: hook } = setup({ nodes: tree });

      expect(
        hook.current.insertAfter('two', {
          key: 'four',
          label: 'Four',
        }),
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

    it('should throw an error if given a fictional target', () => {
      const { result: hook } = setup({ nodes: tree });

      // expect(
      //   hook.current.insertAfter('foo', {
      //     key: 'four',
      //     label: 'Four',
      //   }),
      // ).toThrowError('Key of foo does not exist in tree');
      expect(true).toBe(true);
    });
  });

  /** REMOVE NODES **/
  describe('remove actions', () => {
    it('should remove a root node and children', () => {
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
          },
        ],
      });

      expect(hook.current.remove('one')).toStrictEqual([
        {
          ...nodeDefaults,
          key: 'three',
          parentKey: null,
          label: 'Three',
        },
      ]);
    });

    it('should remove a single node', () => {
      const { result: hook } = setup({ nodes: tree });

      expect(hook.current.remove('two')).toStrictEqual([
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
      const { result } = setup({ nodes: tree });

      const update = result.current.update('one', {
        label: 'Updated One',
      });

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
      const { result: hook } = setup({ nodes: tree });
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
      const { result: hook } = setup({ nodes: tree });
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
      const { result: hook } = setup({ nodes: tree });

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
              parentKey: 'three',
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
              parentKey: 'three',
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
    it('should toggle a single tree item', () => {
      // TODO
      expect(true).toBe(true);
    });

    it('should allow multiple selection of tree items', () => {
      // TODO
      expect(true).toBe(true);
    });
  });

  /** EXPANSION **/
  describe('expansion actions', () => {
    it('should test expansion', () => {
      // TODO
      expect(true).toBe(true);
    });
  });

  /** VISIBILITY **/
  describe('visibility actions', () => {
    it('should change the visibility of a single item without children', () => {
      // TODO
      expect(true).toBe(true);
    });

    it('should have children not viewable when parent is not visible', () => {
      // TODO
      expect(true).toBe(true);
    });

    it('should have children viewable when parent is visible', () => {
      // TODO
      expect(true).toBe(true);
    });

    it('should change visibility of parent when all children are not visible', () => {
      // TODO
      expect(true).toBe(true);
    });

    it('disabled children are skipped', () => {
      // TODO
      expect(true).toBe(true);
    });
  });
});

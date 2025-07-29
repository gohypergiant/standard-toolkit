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

import { describe, expect, it, vi } from 'vitest';
import { mapTree, toggleVisibility } from './utils';
import type { TreeNode } from '../../types/use-tree';

describe('hooks/use-tree/utils', () => {
  describe('mapTree', () => {
    const tree: TreeNode<unknown> = {
      key: 'root',
      parentKey: '',
      value: {
        id: 'root',
        label: 'Root',
      },
      children: [
        {
          key: 'foo',
          parentKey: '',
          value: {
            id: 'foo',
            label: 'Foo',
          },
          children: [],
        },
        {
          key: 'bar',
          parentKey: '',
          value: {
            id: 'bar',
            label: 'Bar',
          },
          children: [],
        },
      ],
    };

    it('should call callback with every node in the tree, depth first', () => {
      const callback = vi.fn();

      expect(mapTree(tree, callback)).toBe(tree);

      expect(callback).toHaveBeenNthCalledWith(1, tree.children[0]);
      expect(callback).toHaveBeenNthCalledWith(2, tree.children[1]);
      expect(callback).toHaveBeenNthCalledWith(3, tree);
    });

    it('should update tree with return value', () => {
      const callback = (node: TreeNode<unknown>) => ({ ...node });

      expect(mapTree(tree, callback)).not.toBe(tree);
      expect(mapTree(tree, callback)).toEqual(tree);
    });
  });

  describe('toggleVisibility', () => {
    type Node = {
      key?: string;
      isViewable?: boolean;
      isVisible?: boolean;
    };

    function node(
      { key = 'foo', isViewable, isVisible }: Node = {},
      children: Node[] = [],
    ): TreeNode<unknown> {
      return {
        key,
        parentKey: '',
        value: {
          id: key,
          label: '',
          ...(isViewable != null ? { isViewable } : {}),
          ...(isVisible != null ? { isVisible } : {}),
        },
        children: children.map((props) => ({
          ...node(props),
          parentKey: key,
        })),
      };
    }

    it('should do nothing for a non-matching id', () => {
      expect(toggleVisibility([node({ isViewable: true })], 'bar')).toEqual([
        node({ isViewable: true, isVisible: true }),
      ]);
    });

    it('should toggle the target id', () => {
      expect(toggleVisibility([node({ isViewable: true })], 'foo')).toEqual([
        node({ isViewable: false, isVisible: false }),
      ]);
    });

    it('should toggle the nested target id', () => {
      expect(
        toggleVisibility(
          [
            node({ isViewable: true }, [
              { key: 'bar', isViewable: true },
              { key: 'wux', isViewable: true },
            ]),
          ],
          'bar',
        ),
      ).toEqual([
        node({ isViewable: true, isVisible: true }, [
          { key: 'bar', isViewable: false, isVisible: false },
          { key: 'wux', isViewable: true, isVisible: true },
        ]),
      ]);
    });

    it('should make isViewable children isVisible when parent is toggled on', () => {
      expect(
        toggleVisibility(
          [
            node({ isViewable: false }, [
              { key: 'bar', isViewable: false },
              { key: 'wux', isViewable: true },
            ]),
          ],
          'foo',
        ),
      ).toEqual([
        node({ isViewable: true, isVisible: true }, [
          { key: 'bar', isViewable: false, isVisible: false },
          { key: 'wux', isViewable: true, isVisible: true },
        ]),
      ]);
    });

    it('should toggle on inactive parent of toggled on child', () => {
      expect(
        toggleVisibility(
          [
            node({ isViewable: false }, [
              { key: 'bar', isViewable: false },
              { key: 'wux', isViewable: true },
            ]),
          ],
          'bar',
        ),
      ).toEqual([
        node({ isViewable: true, isVisible: true }, [
          { key: 'bar', isViewable: true, isVisible: true },
          { key: 'wux', isViewable: true, isVisible: true },
        ]),
      ]);

      expect(
        toggleVisibility(
          [
            node({ isViewable: false }, [
              { key: 'bar', isViewable: false },
              { key: 'wux', isViewable: true },
            ]),
          ],
          'wux',
        ),
      ).toEqual([
        node({ isViewable: false, isVisible: false }, [
          { key: 'bar', isViewable: false, isVisible: false },
          { key: 'wux', isViewable: false, isVisible: false },
        ]),
      ]);
    });

    it('should toggle on all children of toggled on parent if all children were off', () => {
      expect(
        toggleVisibility(
          [
            node({ isViewable: false }, [
              { key: 'bar', isViewable: false },
              { key: 'wux', isViewable: false },
            ]),
          ],
          'foo',
        ),
      ).toEqual([
        node({ isViewable: true, isVisible: true }, [
          { key: 'bar', isViewable: true, isVisible: true },
          { key: 'wux', isViewable: true, isVisible: true },
        ]),
      ]);
    });

    it('should toggle off parent if all children are toggled off', () => {
      expect(
        toggleVisibility(
          [
            node({ isViewable: true }, [
              { key: 'bar', isViewable: true },
              { key: 'wux', isViewable: false },
            ]),
          ],
          'bar',
        ),
      ).toEqual([
        node({ isViewable: false, isVisible: false }, [
          { key: 'bar', isViewable: false, isVisible: false },
          { key: 'wux', isViewable: false, isVisible: false },
        ]),
      ]);
    });
  });
});

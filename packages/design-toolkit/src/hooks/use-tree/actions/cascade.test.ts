/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTreeActions } from './index';
import type { TreeNode } from '../types';

describe('Cascade Selection', () => {
  // Test data: simple hierarchy
  const simpleTree: TreeNode<unknown>[] = [
    {
      key: 'parent',
      label: 'Parent',
      children: [
        {
          key: 'child1',
          label: 'Child 1',
        },
        {
          key: 'child2',
          label: 'Child 2',
        },
      ],
    },
  ];

  // Test data: with disabled nodes
  const treeWithDisabled: TreeNode<unknown>[] = [
    {
      key: 'parent',
      label: 'Parent',
      children: [
        {
          key: 'child1',
          label: 'Child 1',
        },
        {
          key: 'child2',
          label: 'Child 2',
          isDisabled: true,
        },
        {
          key: 'child3',
          label: 'Child 3',
        },
      ],
    },
  ];

  // Test data: deep hierarchy
  const deepTree: TreeNode<unknown>[] = [
    {
      key: 'root',
      label: 'Root',
      children: [
        {
          key: 'level1',
          label: 'Level 1',
          children: [
            {
              key: 'level2a',
              label: 'Level 2A',
            },
            {
              key: 'level2b',
              label: 'Level 2B',
            },
          ],
        },
      ],
    },
  ];

  describe('Basic cascade selection', () => {
    it('should select parent and all children when parent is selected', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      const updated = result.current.onSelectionChange(new Set(['parent']));

      // Find nodes in updated tree
      const parent = updated.find((n) => n.key === 'parent');
      const child1 = parent?.children?.find((n) => n.key === 'child1');
      const child2 = parent?.children?.find((n) => n.key === 'child2');

      expect(parent?.isSelected).toBe(true);
      expect(child1?.isSelected).toBe(true);
      expect(child2?.isSelected).toBe(true);
    });

    it('should deselect parent and all children when parent is deselected', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      // First select
      let updated = result.current.onSelectionChange(new Set(['parent']));

      // Then deselect
      updated = result.current.onSelectionChange(new Set());

      const parent = updated.find((n) => n.key === 'parent');
      const child1 = parent?.children?.find((n) => n.key === 'child1');
      const child2 = parent?.children?.find((n) => n.key === 'child2');

      expect(parent?.isSelected).toBe(false);
      expect(child1?.isSelected).toBe(false);
      expect(child2?.isSelected).toBe(false);
    });

    it('should preserve tree structure after selection', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      const updated = result.current.onSelectionChange(new Set(['parent']));

      expect(updated).toHaveLength(1);
      expect(updated[0]?.key).toBe('parent');
      expect(updated[0]?.children).toHaveLength(2);
      expect(updated[0]?.children?.[0]?.key).toBe('child1');
      expect(updated[0]?.children?.[1]?.key).toBe('child2');
    });
  });

  describe('Disabled nodes', () => {
    it('should skip disabled nodes during cascade', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: treeWithDisabled, selectionCascade: true }),
      );

      const updated = result.current.onSelectionChange(new Set(['parent']));

      const parent = updated.find((n) => n.key === 'parent');
      const child1 = parent?.children?.find((n) => n.key === 'child1');
      const child2 = parent?.children?.find((n) => n.key === 'child2');
      const child3 = parent?.children?.find((n) => n.key === 'child3');

      expect(parent?.isSelected).toBe(true);
      expect(child1?.isSelected).toBe(true);
      expect(child2?.isSelected).toBe(false); // disabled, should remain unselected
      expect(child3?.isSelected).toBe(true);
    });

    it('should show parent as fully selected when all selectable children are selected', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: treeWithDisabled, selectionCascade: true }),
      );

      const updated = result.current.onSelectionChange(new Set(['parent']));

      const parent = updated.find((n) => n.key === 'parent');

      // Parent should be fully selected (not indeterminate) because all SELECTABLE children are selected
      expect(parent?.isSelected).toBe(true);
      expect(parent?.isIndeterminate).toBe(false);
    });
  });

  describe('Indeterminate state', () => {
    it('should set parent to indeterminate when some children are selected', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      // Select only one child
      const updated = result.current.onSelectionChange(new Set(['child1']));

      const parent = updated.find((n) => n.key === 'parent');

      expect(parent?.isSelected).toBe(false);
      expect(parent?.isIndeterminate).toBe(true);
    });

    it('should set parent to selected when all children are manually selected', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      // Select both children manually
      const updated = result.current.onSelectionChange(
        new Set(['child1', 'child2']),
      );

      const parent = updated.find((n) => n.key === 'parent');

      expect(parent?.isSelected).toBe(true);
      expect(parent?.isIndeterminate).toBe(false);
    });

    it('should bubble indeterminate state up through ancestors', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: deepTree, selectionCascade: true }),
      );

      // Select only one leaf
      const updated = result.current.onSelectionChange(new Set(['level2a']));

      const root = updated.find((n) => n.key === 'root');
      const level1 = root?.children?.find((n) => n.key === 'level1');
      const level2a = level1?.children?.find((n) => n.key === 'level2a');

      expect(level2a?.isSelected).toBe(true);
      expect(level1?.isIndeterminate).toBe(true);
      expect(root?.isIndeterminate).toBe(true);
    });

    it('should clear indeterminate when all children become selected', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      // First: select one child (parent becomes indeterminate)
      let updated = result.current.onSelectionChange(new Set(['child1']));
      let parent = updated.find((n) => n.key === 'parent');
      expect(parent?.isIndeterminate).toBe(true);

      // Then: select all children
      updated = result.current.onSelectionChange(new Set(['child1', 'child2']));
      parent = updated.find((n) => n.key === 'parent');

      expect(parent?.isIndeterminate).toBe(false);
      expect(parent?.isSelected).toBe(true);
    });
  });

  describe('Deep hierarchies', () => {
    it('should cascade through all levels', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: deepTree, selectionCascade: true }),
      );

      const updated = result.current.onSelectionChange(new Set(['root']));

      const root = updated.find((n) => n.key === 'root');
      const level1 = root?.children?.find((n) => n.key === 'level1');
      const level2a = level1?.children?.find((n) => n.key === 'level2a');
      const level2b = level1?.children?.find((n) => n.key === 'level2b');

      expect(root?.isSelected).toBe(true);
      expect(level1?.isSelected).toBe(true);
      expect(level2a?.isSelected).toBe(true);
      expect(level2b?.isSelected).toBe(true);
    });

    it('should bubble up through all levels', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: deepTree, selectionCascade: true }),
      );

      // Select both leaf nodes
      const updated = result.current.onSelectionChange(
        new Set(['level2a', 'level2b']),
      );

      const root = updated.find((n) => n.key === 'root');
      const level1 = root?.children?.find((n) => n.key === 'level1');

      expect(root?.isSelected).toBe(true);
      expect(level1?.isSelected).toBe(true);
    });
  });

  describe('selectAll and unselectAll', () => {
    it('should clear indeterminate state when selectAll is called', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      // First create indeterminate state
      let updated = result.current.onSelectionChange(new Set(['child1']));
      let parent = updated.find((n) => n.key === 'parent');
      expect(parent?.isIndeterminate).toBe(true);

      // Then select all
      updated = result.current.selectAll();
      parent = updated.find((n) => n.key === 'parent');

      expect(parent?.isIndeterminate).toBe(false);
      expect(parent?.isSelected).toBe(true);
    });

    it('should clear indeterminate state when unselectAll is called', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );

      // First create indeterminate state
      let updated = result.current.onSelectionChange(new Set(['child1']));
      let parent = updated.find((n) => n.key === 'parent');
      expect(parent?.isIndeterminate).toBe(true);

      // Then unselect all
      updated = result.current.unselectAll();
      parent = updated.find((n) => n.key === 'parent');

      expect(parent?.isIndeterminate).toBe(false);
      expect(parent?.isSelected).toBe(false);
    });
  });

  describe('Non-cascade mode (default behavior)', () => {
    it('should not cascade when selectionCascade is false', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: false }),
      );

      const updated = result.current.onSelectionChange(new Set(['parent']));

      const parent = updated.find((n) => n.key === 'parent');
      const child1 = parent?.children?.find((n) => n.key === 'child1');
      const child2 = parent?.children?.find((n) => n.key === 'child2');

      expect(parent?.isSelected).toBe(true);
      expect(child1?.isSelected).toBe(false);
      expect(child2?.isSelected).toBe(false);
    });

    it('should not have indeterminate state when cascade is disabled', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: false }),
      );

      const updated = result.current.onSelectionChange(new Set(['child1']));

      const parent = updated.find((n) => n.key === 'parent');

      expect(parent?.isIndeterminate).toBe(false);
    });
  });

  describe('Move with cascade (drag-and-drop)', () => {
    const twoParentTree: TreeNode<unknown>[] = [
      {
        key: 'parent1',
        label: 'Parent 1',
        children: [{ key: 'child1', label: 'Child 1' }],
      },
      {
        key: 'parent2',
        label: 'Parent 2',
        children: [{ key: 'child2', label: 'Child 2' }],
      },
    ];

    it('should clear indeterminate state when selected child is moved out via moveAfter', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );
      // Select child1 only — parent becomes indeterminate
      result.current.onSelectionChange(new Set(['child1']));
      // Move child1 to root level (after parent)
      const updated = result.current.moveAfter('parent', new Set(['child1']));
      const parent = updated.find((n) => n.key === 'parent');
      // parent now only has child2 (unselected), no longer indeterminate
      expect(parent?.isIndeterminate).toBe(false);
      expect(parent?.isSelected).toBe(false);
    });

    it('should clear indeterminate state when selected child is moved out via moveBefore', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: simpleTree, selectionCascade: true }),
      );
      // Select child1 only — parent becomes indeterminate
      result.current.onSelectionChange(new Set(['child1']));
      // Move child1 to root level (before parent)
      const updated = result.current.moveBefore('parent', new Set(['child1']));
      const parent = updated.find((n) => n.key === 'parent');
      // parent now only has child2 (unselected), no longer indeterminate
      expect(parent?.isIndeterminate).toBe(false);
      expect(parent?.isSelected).toBe(false);
    });

    it('should update new parent to indeterminate when a selected child is moved in via moveInto', () => {
      const { result } = renderHook(() =>
        useTreeActions({ nodes: twoParentTree, selectionCascade: true }),
      );
      // Select child1 — parent1 becomes selected (its only selectable child)
      result.current.onSelectionChange(new Set(['child1']));
      // Move child1 into parent2 (which has unselected child2)
      const updated = result.current.moveInto('parent2', new Set(['child1']));
      const parent2 = updated.find((n) => n.key === 'parent2');
      // parent2 now has child1 (selected) and child2 (unselected) → indeterminate
      expect(parent2?.isIndeterminate).toBe(true);
    });
  });
});

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
import { renderHook, act } from '@testing-library/react';
import { useTreeState } from './index';
import type { TreeNode } from '../types';

describe('useTreeState with cascade selection', () => {
  const testTree: TreeNode<unknown>[] = [
    {
      key: 'folder',
      label: 'Folder',
      children: [
        {
          key: 'file1',
          label: 'File 1',
        },
        {
          key: 'file2',
          label: 'File 2',
        },
      ],
    },
  ];

  describe('Controlled mode', () => {
    it('should cascade selection through tree in controlled mode', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');
      const file1 = folder?.children?.find((n) => n.key === 'file1');
      const file2 = folder?.children?.find((n) => n.key === 'file2');

      expect(folder?.isSelected).toBe(true);
      expect(file1?.isSelected).toBe(true);
      expect(file2?.isSelected).toBe(true);
    });

    it('should update nodes state after cascade selection', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      const initialNodes = result.current.nodes;

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
      });

      // Nodes should be a new array reference
      expect(result.current.nodes).not.toBe(initialNodes);

      // But should have same structure
      expect(result.current.nodes).toHaveLength(1);
      expect(result.current.nodes[0].key).toBe('folder');
    });

    it('should handle rapid selection changes', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
        result.current.actions.onSelectionChange(new Set());
        result.current.actions.onSelectionChange(new Set(['file1']));
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');
      const file1 = folder?.children?.find((n) => n.key === 'file1');
      const file2 = folder?.children?.find((n) => n.key === 'file2');

      expect(folder?.isIndeterminate).toBe(true);
      expect(file1?.isSelected).toBe(true);
      expect(file2?.isSelected).toBe(false);
    });
  });

  describe('Uncontrolled mode', () => {
    it('should maintain internal state across actions', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      // Select folder
      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
      });

      const afterSelect = result.current.nodes.find((n) => n.key === 'folder');
      expect(afterSelect?.isSelected).toBe(true);

      // Deselect all
      act(() => {
        result.current.actions.unselectAll();
      });

      const afterDeselect = result.current.nodes.find(
        (n) => n.key === 'folder',
      );
      expect(afterDeselect?.isSelected).toBe(false);
      expect(afterDeselect?.isIndeterminate).toBe(false);
    });

    it('should preserve tree structure after multiple operations', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
        result.current.actions.unselectAll();
        result.current.actions.selectAll();
        result.current.actions.onSelectionChange(new Set(['file1']));
      });

      expect(result.current.nodes).toHaveLength(1);
      expect(result.current.nodes[0].children).toHaveLength(2);
      expect(result.current.nodes[0].children?.[0].key).toBe('file1');
      expect(result.current.nodes[0].children?.[1].key).toBe('file2');
    });
  });

  describe('Actions API', () => {
    it('should expose selectAll action', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.selectAll();
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');
      const file1 = folder?.children?.find((n) => n.key === 'file1');

      expect(folder?.isSelected).toBe(true);
      expect(file1?.isSelected).toBe(true);
      expect(folder?.isIndeterminate).toBe(false);
    });

    it('should expose unselectAll action', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.selectAll();
        result.current.actions.unselectAll();
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');
      const file1 = folder?.children?.find((n) => n.key === 'file1');

      expect(folder?.isSelected).toBe(false);
      expect(file1?.isSelected).toBe(false);
      expect(folder?.isIndeterminate).toBe(false);
    });

    it('should expose onSelectionChange action', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      expect(typeof result.current.actions.onSelectionChange).toBe('function');
    });
  });

  describe('Drag and Drop integration', () => {
    it('should provide dragAndDropConfig', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      expect(result.current.dragAndDropConfig).toBeDefined();
      expect(typeof result.current.dragAndDropConfig.getItems).toBe('function');
    });

    it('should maintain selection state after drag operations', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
      });

      // Simulate drag (getItems should see selected state)
      const dragItems = result.current.dragAndDropConfig.getItems(
        new Set(['folder', 'file1', 'file2']),
      );

      expect(dragItems).toHaveLength(3);
      expect(dragItems[0].key).toBe('folder');
    });
  });

  describe('Cascade mode disabled', () => {
    it('should not cascade when selectionCascade is false', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: false }),
      );

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');
      const file1 = folder?.children?.find((n) => n.key === 'file1');

      expect(folder?.isSelected).toBe(true);
      expect(file1?.isSelected).toBe(false);
    });

    it('should not cascade when selectionCascade is omitted', () => {
      const { result } = renderHook(() => useTreeState({ items: testTree }));

      act(() => {
        result.current.actions.onSelectionChange(new Set(['folder']));
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');
      const file1 = folder?.children?.find((n) => n.key === 'file1');

      expect(folder?.isSelected).toBe(true);
      expect(file1?.isSelected).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty tree', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: [], selectionCascade: true }),
      );

      expect(result.current.nodes).toEqual([]);

      act(() => {
        result.current.actions.selectAll();
      });

      expect(result.current.nodes).toEqual([]);
    });

    it('should handle single node tree', () => {
      const singleNode: TreeNode<unknown>[] = [
        {
          key: 'single',
          label: 'Single Node',
        },
      ];

      const { result } = renderHook(() =>
        useTreeState({ items: singleNode, selectionCascade: true }),
      );

      act(() => {
        result.current.actions.onSelectionChange(new Set(['single']));
      });

      const node = result.current.nodes.find((n) => n.key === 'single');

      expect(node?.isSelected).toBe(true);
      expect(node?.isIndeterminate).toBe(false);
    });

    it('should handle invalid keys gracefully', () => {
      const { result } = renderHook(() =>
        useTreeState({ items: testTree, selectionCascade: true }),
      );

      // Should not throw
      act(() => {
        result.current.actions.onSelectionChange(
          new Set(['nonexistent', 'folder']),
        );
      });

      const folder = result.current.nodes.find((n) => n.key === 'folder');

      // Should still process valid keys
      expect(folder?.isSelected).toBe(true);
    });
  });
});

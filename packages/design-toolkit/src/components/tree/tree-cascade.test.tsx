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

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useState } from 'react';
import { useTreeState } from '@/hooks/use-tree/state';
import { Tree } from './index';
import { TreeItem } from './item';
import { TreeItemContent } from './item-content';
import type { TreeNode } from '@/hooks/use-tree/types';
import type { Selection } from '@react-types/shared';

describe('Tree component with cascade selection', () => {
  const testTree: TreeNode<unknown>[] = [
    {
      key: 'parent',
      label: 'Parent',
      isExpanded: true,
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

  // Helper to query elements by slot attribute
  const getBySlot = (container: HTMLElement, slot: string) =>
    container.querySelectorAll(`label[slot="${slot}"]`);

  function TestTree({ cascade = true }: { cascade?: boolean }) {
    const { nodes, actions } = useTreeState({
      items: testTree,
      selectionCascade: cascade,
    });

    return (
      <Tree
        items={nodes}
        onExpandedChange={actions.onExpandedChange}
        onSelectionChange={actions.onSelectionChange}
        selectionMode='multiple'
        aria-label='Test Tree'
      >
        {(node) => (
          <TreeItem id={node.key} key={node.key} textValue={node.label}>
            <TreeItemContent>{node.label}</TreeItemContent>
            {node.children?.map((child) => (
              <TreeItem id={child.key} key={child.key} textValue={child.label}>
                <TreeItemContent>{child.label}</TreeItemContent>
              </TreeItem>
            ))}
          </TreeItem>
        )}
      </Tree>
    );
  }

  describe('Rendering', () => {
    it('should render tree with checkboxes', () => {
      render(<TestTree />);

      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();

      // Should have checkboxes (selection slots)
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('should render indeterminate checkboxes correctly', async () => {
      const { container } = render(<TestTree />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      expect(selectionLabels.length).toBeGreaterThanOrEqual(2);

      // Click second checkbox (child1)
      await user.click(selectionLabels[1] as HTMLElement);

      // Parent checkbox (first one) should now be indeterminate
      await waitFor(() => {
        const checkboxes = getBySlot(container, 'selection');
        expect(checkboxes[0]).toHaveAttribute('data-indeterminate', 'true');
      });
    });
  });

  describe('User interactions', () => {
    it('should cascade selection when parent is clicked', async () => {
      const { container } = render(<TestTree />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      // Click parent checkbox (first one)
      await user.click(selectionLabels[0] as HTMLElement);

      // All checkboxes should be checked
      await waitFor(() => {
        const checkboxes = getBySlot(container, 'selection');
        checkboxes.forEach((checkbox) => {
          expect(checkbox).toHaveAttribute('data-selected', 'true');
        });
      });
    });

    it('should cascade deselection when parent is unclicked', async () => {
      const { container } = render(<TestTree />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      // Select parent (first checkbox)
      await user.click(selectionLabels[0] as HTMLElement);

      // Check all selected
      await waitFor(() => {
        const updatedLabels = getBySlot(container, 'selection');
        updatedLabels.forEach((label) => {
          expect(label).toHaveAttribute('data-selected', 'true');
        });
      });

      // Deselect parent
      await user.click(selectionLabels[0] as HTMLElement);

      // Check all unselected
      await waitFor(() => {
        const updatedLabels = getBySlot(container, 'selection');
        updatedLabels.forEach((label) => {
          expect(label).not.toHaveAttribute('data-selected');
        });
      });
    });

    it('should update parent to indeterminate when child is clicked', async () => {
      const { container } = render(<TestTree />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      // Click child1 (second checkbox)
      await user.click(selectionLabels[1] as HTMLElement);

      // Parent (first checkbox) should be indeterminate
      await waitFor(() => {
        const updatedLabels = getBySlot(container, 'selection');
        expect(updatedLabels[0]).toHaveAttribute('data-indeterminate', 'true');
      });
    });

    it('should update parent to selected when all children are clicked', async () => {
      const { container } = render(<TestTree />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      // Click child1 (second checkbox)
      await user.click(selectionLabels[1] as HTMLElement);

      // Click child2 (third checkbox)
      await user.click(selectionLabels[2] as HTMLElement);

      // Parent (first checkbox) should be fully selected
      await waitFor(() => {
        const updatedLabels = getBySlot(container, 'selection');
        expect(updatedLabels[0]).toHaveAttribute('data-selected', 'true');
      });
    });
  });

  describe('Controlled mode', () => {
    function ControlledTree() {
      const { nodes, actions } = useTreeState({
        items: testTree,
        selectionCascade: true,
      });

      const [, setExternalSelection] = useState<Selection>(new Set());

      const handleSelectionChange = (selection: Selection) => {
        if (selection !== 'all') {
          actions.onSelectionChange(selection);
          setExternalSelection(selection);
        }
      };

      return (
        <div>
          <button
            type='button'
            onClick={() => handleSelectionChange(new Set(['parent']))}
          >
            Select Parent
          </button>
          <Tree
            items={nodes}
            onExpandedChange={actions.onExpandedChange}
            onSelectionChange={handleSelectionChange}
            selectionMode='multiple'
            aria-label='Controlled Tree'
          >
            {(node) => (
              <TreeItem id={node.key} key={node.key} textValue={node.label}>
                <TreeItemContent>{node.label}</TreeItemContent>
                {node.children?.map((child) => (
                  <TreeItem
                    id={child.key}
                    key={child.key}
                    textValue={child.label}
                  >
                    <TreeItemContent>{child.label}</TreeItemContent>
                  </TreeItem>
                ))}
              </TreeItem>
            )}
          </Tree>
        </div>
      );
    }

    it('should work in controlled mode', async () => {
      const { container } = render(<ControlledTree />);

      const user = userEvent.setup();
      const button = screen.getByText('Select Parent');

      await user.click(button);

      // All checkboxes should be checked
      await waitFor(() => {
        const updatedLabels = getBySlot(container, 'selection');
        updatedLabels.forEach((label) => {
          expect(label).toHaveAttribute('data-selected', 'true');
        });
      });
    });
  });

  describe('Cascade disabled', () => {
    it('should not cascade when selectionCascade is false', async () => {
      const { container } = render(<TestTree cascade={false} />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      // Click parent (first checkbox)
      await user.click(selectionLabels[0] as HTMLElement);

      // Only parent should be checked
      await waitFor(() => {
        const updatedLabels = getBySlot(container, 'selection');
        expect(updatedLabels[0]).toHaveAttribute('data-selected', 'true');
        expect(updatedLabels[1]).not.toHaveAttribute('data-selected');
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onSelectionChange with cascaded keys', async () => {
      const onSelectionChange = vi.fn();

      function CallbackTree() {
        const { nodes, actions } = useTreeState({
          items: testTree,
          selectionCascade: true,
        });

        const handleChange = (selection: Selection) => {
          actions.onSelectionChange(selection);
          onSelectionChange(selection);
        };

        return (
          <Tree
            items={nodes}
            onExpandedChange={actions.onExpandedChange}
            onSelectionChange={handleChange}
            selectionMode='multiple'
            aria-label='Callback Tree'
          >
            {(node) => (
              <TreeItem id={node.key} key={node.key} textValue={node.label}>
                <TreeItemContent>{node.label}</TreeItemContent>
                {node.children?.map((child) => (
                  <TreeItem
                    id={child.key}
                    key={child.key}
                    textValue={child.label}
                  >
                    <TreeItemContent>{child.label}</TreeItemContent>
                  </TreeItem>
                ))}
              </TreeItem>
            )}
          </Tree>
        );
      }

      const { container } = render(<CallbackTree />);

      const user = userEvent.setup();
      const selectionLabels = getBySlot(container, 'selection');

      // Click parent checkbox
      await user.click(selectionLabels[0] as HTMLElement);

      expect(onSelectionChange).toHaveBeenCalled();
    });
  });
});

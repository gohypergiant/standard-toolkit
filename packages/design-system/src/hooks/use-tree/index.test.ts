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

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTree } from './';
import type { TreeGroupNode, UseTreeOptions } from '../../types/use-tree';

function setup({
  nodes = [
    {
      id: 'foo',
      label: 'Foo',
    },
    {
      id: 'bar',
      label: 'Bar',
    },
  ],
  onSelectionChange = vi.fn(),
  onUpdate = vi.fn(),
  ...rest
}: Partial<UseTreeOptions<unknown>> = {}) {
  const options = {
    ...rest,
    nodes,
    onSelectionChange,
    onUpdate,
  };

  return {
    ...renderHook((overrides: Partial<UseTreeOptions<unknown>>) =>
      useTree({ ...options, ...overrides }),
    ),
    options,
  };
}

describe('useTree', () => {
  it('should return tree', () => {
    const { options, result } = setup();

    expect(result.current.tree).toEqual({
      key: expect.any(String),
      children: options.nodes.map((node) => ({
        key: node.id,
        parentKey: null,
        value: node,
        children: [],
      })),
    });
  });

  it('should compute initial visibility, if enabled', () => {
    const { result } = setup({
      allowsVisibility: true,
      nodes: [{ id: 'foo', label: 'Foo', isViewable: true }],
    });

    expect(result.current.tree.children[0]?.value.isVisible).toBe(true);
  });

  it('should toggle expansion of groups', () => {
    const { result } = setup({
      nodes: [
        { id: 'foo', label: 'Foo', nodes: [{ id: 'bar', label: 'Bar' }] },
      ],
    });

    act(() => result.current.actions.toggleIsExpanded());

    expect(
      (result.current.tree.children[0]?.value as TreeGroupNode<unknown>)
        .isExpanded,
    ).toBe(true);

    // Not really a group, but casting to access property
    expect(
      (
        result.current.tree.children[0]?.children[0]
          ?.value as TreeGroupNode<unknown>
      ).isExpanded,
    ).toBeFalsy();
  });

  it('should revert expansion state if previous toggle was revertable', () => {
    const { result } = setup({
      nodes: [
        {
          id: 'foo',
          label: 'Foo',
          isExpanded: true,
          nodes: [{ id: 'bar', label: 'Bar' }],
        },
      ],
    });

    act(() =>
      result.current.actions.toggleIsExpanded(new Set(['foo']), false, true),
    );

    expect(
      (result.current.tree.children[0]?.value as TreeGroupNode<unknown>)
        .isExpanded,
    ).toBe(false);

    act(() => result.current.actions.revertIsExpanded());

    expect(
      (result.current.tree.children[0]?.value as TreeGroupNode<unknown>)
        .isExpanded,
    ).toBe(true);
  });

  it('should toggle selection of all keys', () => {
    const { options, result } = setup({ selectionMode: 'multiple' });
    const selectedKeys = new Set(options.nodes.map(({ id }) => id));

    act(() => result.current.actions.toggleIsSelected());

    expect(result.current.selectedKeys).toEqual(selectedKeys);

    expect(options.onSelectionChange).toHaveBeenCalledWith('all');
  });

  it('should toggle selection of multiple keys', () => {
    const { options, result } = setup({ selectionMode: 'multiple' });
    const selectedKeys = new Set(options.nodes.map(({ id }) => id));

    act(() => result.current.actions.toggleIsSelected(selectedKeys, true));

    expect(result.current.selectedKeys).toEqual(selectedKeys);

    expect(options.onSelectionChange).toHaveBeenCalledWith('all');

    act(() => result.current.actions.toggleIsSelected(selectedKeys, false));

    expect(result.current.selectedKeys).toEqual(new Set());

    expect(options.onSelectionChange).toHaveBeenCalledWith(new Set());
  });

  it('should toggle selection of a key', () => {
    const { options, result } = setup({ selectionMode: 'single' });

    let selectedKeys = new Set(['foo']);

    act(() => result.current.actions.toggleIsSelected(selectedKeys, true));

    expect(result.current.selectedKeys).toEqual(selectedKeys);

    expect(options.onSelectionChange).toHaveBeenCalledWith(selectedKeys);

    selectedKeys = new Set(['bar']);

    act(() => result.current.actions.toggleIsSelected(selectedKeys, true));

    expect(result.current.selectedKeys).toEqual(selectedKeys);

    expect(options.onSelectionChange).toHaveBeenCalledWith(selectedKeys);
  });

  it('should toggle visibility of all keys', () => {
    const { options, result } = setup({ allowsVisibility: true });

    act(() => result.current.actions.toggleIsViewable());

    expect(
      result.current.tree.children.map(
        ({ value: { isViewable, isVisible } }) => ({
          isViewable,
          isVisible,
        }),
      ),
    ).toEqual(options.nodes.map(() => ({ isViewable: true, isVisible: true })));
  });

  it('should toggle visibility of multiple keys', () => {
    const { options, result } = setup({ allowsVisibility: true });

    act(() =>
      result.current.actions.toggleIsViewable(
        new Set(options.nodes.map(({ id }) => id)),
      ),
    );

    expect(
      result.current.tree.children.map(
        ({ value: { isViewable, isVisible } }) => ({
          isViewable,
          isVisible,
        }),
      ),
    ).toEqual(options.nodes.map(() => ({ isViewable: true, isVisible: true })));
  });

  it('should toggle visibility of a key', () => {
    const { result } = setup({ allowsVisibility: true });

    act(() => result.current.actions.toggleIsViewable(new Set(['foo']), true));

    expect(result.current.tree.children[0]?.value).toHaveProperty(
      'isViewable',
      true,
    );

    expect(result.current.tree.children[0]?.value).toHaveProperty(
      'isVisible',
      true,
    );
  });

  it('should not toggle visibility if read-only node', () => {
    const { result } = setup({
      allowsVisibility: true,
      nodes: [
        { id: 'foo', label: 'Foo', isViewable: true, isReadOnly: true }, //
        { id: 'bar', label: 'Bar', isViewable: true, isReadOnly: false },
      ],
    });

    act(() =>
      result.current.actions.toggleIsViewable(new Set(['foo', 'bar']), false),
    );

    expect(result.current.tree.children[0]?.value).toHaveProperty(
      'isViewable',
      true,
    );

    expect(result.current.tree.children[1]?.value).toHaveProperty(
      'isViewable',
      false,
    );
  });
});

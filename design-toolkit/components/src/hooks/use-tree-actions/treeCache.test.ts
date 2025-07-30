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
import type { TreeNode } from '../types';
import {
  type Values,
  complexTree,
  defaultTree,
  nodeDefaults,
} from './_fixtures';
import { treeCache } from './treeCache';

const setup = (props: { nodes?: TreeNode<Values>[] } = {}) => {
  const { nodes = defaultTree } = props;
  const cache = treeCache();
  cache.buildLookup<Values>(nodes ?? [], new Map());
  return cache;
};

describe('treeCache module', () => {
  it('builds a tree from a treeRef', () => {
    const cache = setup();
    expect(cache.toTree()).toStrictEqual([
      {
        ...nodeDefaults,
        key: 'one',
        label: 'One',
        children: [
          {
            ...nodeDefaults,
            parentKey: 'one',
            key: 'two',
            label: 'Two',
          },
          {
            ...nodeDefaults,
            parentKey: 'one',
            key: 'three',
            label: 'Three',
          },
        ],
      },
    ]);
  });

  it('gets a node by key', () => {
    const cache = setup();
    expect(cache.getNode('two')).toStrictEqual({
      ...nodeDefaults,
      key: 'two',
      label: 'Two',
      parentKey: 'one',
    });
  });

  it('sets a node value', () => {
    const cache = setup();
    const node = cache.getNode('two');
    cache.setNode('two', {
      ...node,
      label: 'Dos',
      values: {
        isTrue: true,
        test: 'foo',
      },
    });
    expect(cache.getNode('two')).toStrictEqual({
      ...node,
      label: 'Dos',
      values: {
        isTrue: true,
        test: 'foo',
      },
    });
  });

  describe('addNodes', () => {
    it('adds a single node before a target node', () => {
      const cache = setup({ nodes: complexTree });

      const newNode: TreeNode<Values> = {
        ...nodeDefaults,
        key: 'foo',
        label: 'Foo',
      };

      cache.addNodes('child2', [newNode], 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child1');
      expect(result?.children?.[1]?.key).toBe('foo');
      expect(result?.children?.[2]?.key).toBe('child2');
      expect(result?.children?.[3]?.key).toBe('child3');

      expect(cache.getNode('foo').parentKey).toBe('root1');
    });

    it('adds a single node after a target node', () => {
      const cache = setup({ nodes: complexTree });

      const newNode: TreeNode<Values> = {
        ...nodeDefaults,
        key: 'foo',
        label: 'Foo',
      };

      cache.addNodes('child2', [newNode], 'after');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      // Verify the new node was inserted after child2
      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child1');
      expect(result?.children?.[1]?.key).toBe('child2');
      expect(result?.children?.[2]?.key).toBe('foo');
      expect(result?.children?.[3]?.key).toBe('child3');

      expect(cache.getNode('foo').parentKey).toBe('root1');
    });

    it('adds multiple nodes before a target node', () => {
      const cache = setup({ nodes: complexTree });

      const newNodes: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'foo',
          label: 'Foo',
        },
        {
          ...nodeDefaults,
          key: 'bar',
          label: 'Bar',
        },
      ];

      cache.addNodes('child2', newNodes, 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      // Verify the new nodes were inserted before child2
      expect(result?.children).toHaveLength(5);
      expect(result?.children?.[0]?.key).toBe('child1');
      expect(result?.children?.[1]?.key).toBe('foo');
      expect(result?.children?.[2]?.key).toBe('bar');
      expect(result?.children?.[3]?.key).toBe('child2');
      expect(result?.children?.[4]?.key).toBe('child3');

      // Verify both new nodes have correct parent relationships
      expect(cache.getNode('foo').parentKey).toBe('root1');
      expect(cache.getNode('bar').parentKey).toBe('root1');
    });

    it('adds multiple nodes after a target node', () => {
      const cache = setup({ nodes: complexTree });

      const newNodes: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'foo',
          label: 'Foo',
        },
        {
          ...nodeDefaults,
          key: 'bar',
          label: 'Bar',
        },
      ];

      cache.addNodes('child2', newNodes, 'after');

      const tree = cache.toTree();
      const root1 = tree.find((node) => node.key === 'root1');

      // Verify the new nodes were inserted after child2
      expect(root1?.children).toHaveLength(5);
      expect(root1?.children?.[0]?.key).toBe('child1');
      expect(root1?.children?.[1]?.key).toBe('child2');
      expect(root1?.children?.[2]?.key).toBe('foo');
      expect(root1?.children?.[3]?.key).toBe('bar');
      expect(root1?.children?.[4]?.key).toBe('child3');

      // Verify both new nodes have correct parent relationships
      expect(cache.getNode('foo').parentKey).toBe('root1');
      expect(cache.getNode('bar').parentKey).toBe('root1');
    });

    it('prepends nodes at root', () => {
      const cache = setup({ nodes: complexTree });

      const newNodes: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'foo',
          label: 'Foo',
        },
        {
          ...nodeDefaults,
          key: 'bar',
          label: 'Bar',
        },
      ];

      cache.addNodes(null, newNodes, 'before');

      const tree = cache.toTree();

      // Verify the new nodes were inserted at the beginning
      expect(tree).toHaveLength(4);
      expect(tree[0]?.key).toBe('foo');
      expect(tree[1]?.key).toBe('bar');
      expect(tree[2]?.key).toBe('root1');
      expect(tree[3]?.key).toBe('root2');

      // Verify both new nodes have null parent (root level)
      expect(cache.getNode('foo').parentKey).toBe(null);
      expect(cache.getNode('bar').parentKey).toBe(null);
    });

    it('appends nodes at root', () => {
      const cache = setup({ nodes: complexTree });

      const newNodes: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'foo',
          label: 'Foo',
        },
        {
          ...nodeDefaults,
          key: 'bar',
          label: 'Bar',
        },
      ];

      cache.addNodes(null, newNodes, 'after');

      const tree = cache.toTree();

      // Verify the new nodes were inserted at the end
      expect(tree).toHaveLength(4);
      expect(tree[0]?.key).toBe('root1');
      expect(tree[1]?.key).toBe('root2');
      expect(tree[2]?.key).toBe('foo');
      expect(tree[3]?.key).toBe('bar');

      // Verify both new nodes have null parent (root level)
      expect(cache.getNode('foo').parentKey).toBe(null);
      expect(cache.getNode('bar').parentKey).toBe(null);
    });

    it('adds nodes with children', () => {
      const cache = setup({ nodes: complexTree });

      const newNodeWithChildren: TreeNode<Values> = {
        ...nodeDefaults,
        key: 'parent',
        label: 'Parent Node',
        children: [
          {
            ...nodeDefaults,
            key: 'childA',
            parentKey: 'parent',
            label: 'Child A',
          },
          {
            ...nodeDefaults,
            key: 'childB',
            parentKey: 'parent',
            label: 'Child B',
          },
        ],
      };

      cache.addNodes('child2', [newNodeWithChildren], 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      // Verify the parent node was inserted
      expect(result?.children).toHaveLength(4);
      const insertedParent = result?.children?.find(
        (child) => child.key === 'parent',
      );
      expect(insertedParent).toBeDefined();
      expect(insertedParent?.parentKey).toBe('root1');

      // Verify the children are accessible
      expect(cache.getNode('childA')).toBeDefined();
      expect(cache.getNode('childB')).toBeDefined();
      expect(cache.getNode('childA').parentKey).toBe('parent');
      expect(cache.getNode('childB').parentKey).toBe('parent');
    });

    it('adds nodes to an empty tree', () => {
      const cache = setup({ nodes: [] });

      const newNodes: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'firstNode',
          label: 'First Node',
        },
        {
          ...nodeDefaults,
          key: 'secondNode',
          label: 'Second Node',
        },
      ];

      cache.addNodes(null, newNodes, 'before');

      const tree = cache.toTree();

      // Verify nodes were added to empty tree
      expect(tree).toHaveLength(2);
      expect(tree[0]?.key).toBe('firstNode');
      expect(tree[1]?.key).toBe('secondNode');

      // Verify both nodes have null parent (root level)
      expect(cache.getNode('firstNode').parentKey).toBe(null);
      expect(cache.getNode('secondNode').parentKey).toBe(null);
    });

    it('adds nodes before the first child', () => {
      const cache = setup({ nodes: complexTree });

      const newNode: TreeNode<Values> = {
        ...nodeDefaults,
        key: 'newFirst',
        label: 'New First',
      };

      cache.addNodes('child1', [newNode], 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      // Verify the new node was inserted as the first child
      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('newFirst');
      expect(result?.children?.[1]?.key).toBe('child1');
      expect(result?.children?.[2]?.key).toBe('child2');
      expect(result?.children?.[3]?.key).toBe('child3');
    });

    it('adds nodes after the last child', () => {
      const cache = setup({ nodes: complexTree });

      const newNode: TreeNode<Values> = {
        ...nodeDefaults,
        key: 'newLast',
        label: 'New Last',
      };

      cache.addNodes('child3', [newNode], 'after');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      // Verify the new node was inserted as the last child
      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child1');
      expect(result?.children?.[1]?.key).toBe('child2');
      expect(result?.children?.[2]?.key).toBe('child3');
      expect(result?.children?.[3]?.key).toBe('newLast');
    });

    it('maintains order when adding multiple nodes', () => {
      const cache = setup({ nodes: complexTree });

      const newNodes: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'nodeA',
          label: 'Node A',
        },
        {
          ...nodeDefaults,
          key: 'nodeB',
          label: 'Node B',
        },
        {
          ...nodeDefaults,
          key: 'nodeC',
          label: 'Node C',
        },
      ];

      cache.addNodes('child2', newNodes, 'before');

      const tree = cache.toTree();
      const root1 = tree.find((node) => node.key === 'root1');

      // Verify the order is maintained
      expect(root1?.children).toHaveLength(6);
      expect(root1?.children?.[0]?.key).toBe('child1');
      expect(root1?.children?.[1]?.key).toBe('nodeA');
      expect(root1?.children?.[2]?.key).toBe('nodeB');
      expect(root1?.children?.[3]?.key).toBe('nodeC');
      expect(root1?.children?.[4]?.key).toBe('child2');
      expect(root1?.children?.[5]?.key).toBe('child3');
    });
  });

  describe('deleteNode', () => {
    it('deletes a leaf node from the tree', () => {
      const cache = setup({ nodes: complexTree });

      cache.deleteNode('child1');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(2);
      expect(result?.children?.map((child) => child.key)).toEqual([
        'child2',
        'child3',
      ]);

      expect(() => cache.getNode('child1')).toThrow();
    });

    it('deletes a parent node and all its children', () => {
      const cache = setup({ nodes: complexTree });

      cache.deleteNode('root1');

      const tree = cache.toTree();

      expect(tree).toHaveLength(1);
      expect(tree[0]?.key).toBe('root2');

      expect(() => cache.getNode('child1')).toThrow();
      expect(() => cache.getNode('child2')).toThrow();
      expect(() => cache.getNode('child3')).toThrow();
    });

    it('deletes a root level node', () => {
      const cache = setup({ nodes: complexTree });

      cache.deleteNode('root2');

      const tree = cache.toTree();

      expect(tree).toHaveLength(1);
      expect(tree[0]?.key).toBe('root1');

      expect(() => cache.getNode('child4')).toThrow();
      expect(() => cache.getNode('child5')).toThrow();
    });

    it('deletes a node with nested children', () => {
      // Create a tree with nested structure
      const nestedTree: TreeNode<Values>[] = [
        {
          ...nodeDefaults,
          key: 'root',
          label: 'Root',
          children: [
            {
              ...nodeDefaults,
              key: 'parent',
              parentKey: 'root',
              label: 'Parent',
              children: [
                {
                  ...nodeDefaults,
                  key: 'child1',
                  parentKey: 'parent',
                  label: 'Child 1',
                },
                {
                  ...nodeDefaults,
                  key: 'child2',
                  parentKey: 'parent',
                  label: 'Child 2',
                },
              ],
            },
          ],
        },
      ];

      const cache = setup({ nodes: nestedTree });

      cache.deleteNode('parent');

      const tree = cache.toTree();

      expect(tree).toHaveLength(1);
      expect(tree[0]?.key).toBe('root');
      expect(tree[0]?.children).toHaveLength(0);

      expect(() => cache.getNode('child1')).toThrow();
      expect(() => cache.getNode('child2')).toThrow();
    });

    it('handles deleting a non-existent node gracefully', () => {
      const cache = setup({ nodes: complexTree });

      // Try to delete a non-existent node
      expect(() => cache.deleteNode('non-existent')).not.toThrow();

      const tree = cache.toTree();

      // Verify the tree remains unchanged
      expect(tree).toHaveLength(2);
      expect(tree[0]?.key).toBe('root1');
      expect(tree[1]?.key).toBe('root2');
    });

    it('deletes all nodes from the tree', () => {
      const cache = setup({ nodes: complexTree });

      // Delete all root nodes
      cache.deleteNode('root1');
      cache.deleteNode('root2');

      const tree = cache.toTree();

      // Verify tree is empty
      expect(tree).toHaveLength(0);
    });

    it('deletes a node and updates parent children array correctly', () => {
      const cache = setup({ nodes: complexTree });

      cache.deleteNode('child1');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(2);
      expect(result?.children?.map((child) => child.key)).toEqual([
        'child2',
        'child3',
      ]);

      // Verify the remaining children are still accessible
      expect(cache.getNode('child2')).toBeDefined();
      expect(cache.getNode('child3')).toBeDefined();
    });
  });

  describe('moveNodes', () => {
    it('moves a single node before a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child2']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(3);
      expect(result?.children?.[0]?.key).toBe('child2');
      expect(result?.children?.[1]?.key).toBe('child4');
      expect(result?.children?.[2]?.key).toBe('child5');

      expect(cache.getNode('child2').parentKey).toBe('root2');
    });

    it('moves a single node after a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child1']), 'after');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(3);
      expect(result?.children?.[0]?.key).toBe('child4');
      expect(result?.children?.[1]?.key).toBe('child1');
      expect(result?.children?.[2]?.key).toBe('child5');

      expect(cache.getNode('child1').parentKey).toBe('root2');
    });

    it('moves multiple nodes before a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child1', 'child2']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child1');
      expect(result?.children?.[1]?.key).toBe('child2');
      expect(result?.children?.[2]?.key).toBe('child4');
      expect(result?.children?.[3]?.key).toBe('child5');

      expect(cache.getNode('child1').parentKey).toBe('root2');
      expect(cache.getNode('child2').parentKey).toBe('root2');
    });

    it('moves multiple nodes after a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child2', 'child3']), 'after');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child4');
      expect(result?.children?.[1]?.key).toBe('child2');
      expect(result?.children?.[2]?.key).toBe('child3');
      expect(result?.children?.[3]?.key).toBe('child5');

      expect(cache.getNode('child2').parentKey).toBe('root2');
      expect(cache.getNode('child3').parentKey).toBe('root2');
    });

    it('moves nodes to the beginning of root level when target is null and position is before', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes(null, new Set(['child1', 'child2']), 'before');

      const tree = cache.toTree();

      expect(tree).toHaveLength(4);
      expect(tree[0]?.key).toBe('child1');
      expect(tree[1]?.key).toBe('child2');
      expect(tree[2]?.key).toBe('root1');
      expect(tree[3]?.key).toBe('root2');

      expect(cache.getNode('child1').parentKey).toBe(null);
      expect(cache.getNode('child2').parentKey).toBe(null);
    });

    it('moves nodes to the end of root level when target is null and position is after', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes(null, new Set(['child1', 'child2']), 'after');

      const tree = cache.toTree();

      expect(tree).toHaveLength(4);
      expect(tree[0]?.key).toBe('root1');
      expect(tree[1]?.key).toBe('root2');
      expect(tree[2]?.key).toBe('child1');
      expect(tree[3]?.key).toBe('child2');

      expect(cache.getNode('child1').parentKey).toBe(null);
      expect(cache.getNode('child2').parentKey).toBe(null);
    });

    it('reorders nodes within the same parent', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child1', new Set(['child3']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(3);
      expect(result?.children?.[0]?.key).toBe('child3');
      expect(result?.children?.[1]?.key).toBe('child1');
      expect(result?.children?.[2]?.key).toBe('child2');

      // Verify child3's parent remains the same
      expect(cache.getNode('child3').parentKey).toBe('root1');
    });

    it('removes moved nodes from their original parent', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child1', 'child2']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(1);
      expect(result?.children?.[0]?.key).toBe('child3');
    });
  });
});

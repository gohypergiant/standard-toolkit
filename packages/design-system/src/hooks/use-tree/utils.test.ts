import { describe, expect, it, vi } from 'vitest';
import type { TreeNode } from '../../types';
import { mapTree, toggleVisibility } from './utils';

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

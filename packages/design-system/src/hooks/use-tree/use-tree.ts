import { useTreeData } from '@react-stately/data';
import type { Key } from '@react-types/shared';
import { isEqual } from 'lodash';
import { useCallback, useId, useMemo, useRef } from 'react';
import { useUpdateEffect } from '../use-update-effect';
import type {
  TreeActions,
  TreeNode,
  TreeNodes,
  UseTreeOptions,
  UseTreeResult,
} from '../../types';
import { getChildren, getKey, mapTree, toggleVisibility } from './utils';

export function useTree<T>({
  allowsExpansion = true,
  allowsVisibility = false,
  nodes,
  selectionMode = 'none',
  onSelectionChange,
  onUpdate,
}: UseTreeOptions<T>): UseTreeResult<T> {
  const rootKey = useId();

  const list = useTreeData({
    initialItems: nodes,
    getChildren,
    getKey,
  });

  useUpdateEffect(() => {
    if (selectionMode === 'none' && list.selectedKeys.size) {
      list.setSelectedKeys(new Set());
    }
  }, [selectionMode, list.selectedKeys.size]);

  /**
   * useTreeData doesn't update the state of TreeNode.value when updates
   * are made to children.
   *
   * Given the structure:
   * Foo
   * - Bar
   * - Cat
   *
   * There will be TreeNodes for each item, with a value that represents
   * the original node passed in. If an update occurs to one of the child
   * nodes (Bar, Cat), then Foo node's value is NOT updated to reflect that
   * change. This means that each node is the source of truth only for itself
   * and not any of its children.
   *
   * To provide a completely accurate tree, we need to override the getItem
   * and update methods, as well as replace the list.items with a tree that
   * is completely accurate at all times. This requires storing (depth first)
   * each node in a lookup, so that parent node's values can be updated to
   * reflect the current state of their children.
   */
  const { lookup, tree, getItem, update } = useMemo(() => {
    const lookup: Record<Key, TreeNode<T>> = {};

    let tree = mapTree(
      {
        key: rootKey,
        children: list.items,
      } as TreeNode<T>,
      (node) => {
        if (node.key === rootKey) {
          return;
        }

        node = lookup[node.key] = getItem(node.key);

        return node;
      },
    );

    if (allowsVisibility) {
      tree = mapTree(
        {
          key: rootKey,
          children: toggleVisibility(tree.children),
        } as TreeNode<T>,
        (node) => {
          if (node.key === rootKey) {
            return;
          }

          lookup[node.key] = node;

          return node;
        },
      );
    }

    function getItem(key: Key): TreeNode<T> {
      let node = lookup[key];

      if (node) {
        return node;
      }

      node = list.getItem(key);

      if ('nodes' in node.value) {
        return {
          ...node,
          value: {
            ...node.value,
            nodes: node.children.flatMap((child) => {
              const value = lookup[child.key]?.value;

              if (value) {
                return [value];
              }

              return [];
            }),
          },
        };
      }

      return node;
    }

    function update(key: Key, patch: Partial<TreeNodes<T>>) {
      const node = getItem(key);

      let value: TreeNode<T>['value'];

      if ('nodes' in node.value) {
        value = {
          ...node.value,
          ...patch,
          // Disallow a parent update to change child values
          nodes: node.children.flatMap((child) => {
            const value = lookup[child.key]?.value;

            if (value) {
              return [value];
            }

            return [];
          }),
        };
      } else {
        value = {
          ...node.value,
          ...patch,
        };
      }

      /**
       * We must immediately update the state of the lookup due to the
       * possibility of a queue of state changes and we can't allow for
       * a parent to update and wipe out a previous child update
       */
      lookup[key] = {
        ...node,
        value,
      };

      list.update(key, value);
    }

    return { lookup, tree, getItem, update };
  }, [rootKey, list, allowsVisibility]);

  const treeRef = useRef(tree);

  /**
   * Because tree is a computed value and there are so many methods
   * that update list.items, it's far simpler to fire the onUpdate
   * during the render cycle. However, this means that onUpdate can
   * only be used for side effect purposes and should not trigger
   * state updates
   */
  useUpdateEffect(() => {
    if (isEqual(treeRef.current, tree)) {
      return;
    }

    treeRef.current = tree;

    onUpdate?.(tree.children.map(({ value }) => value));
  }, [tree]);

  const previousExpansionValuesRef = useRef<
    {
      key: Key;
      patch: { isExpanded?: boolean };
    }[]
  >([]);

  const revertIsExpanded = useCallback(() => {
    if (!previousExpansionValuesRef.current.length) {
      return;
    }

    for (const { key, patch } of previousExpansionValuesRef.current) {
      update(key, patch);
    }

    previousExpansionValuesRef.current = [];
  }, [update]);

  const toggleIsExpanded = useCallback<TreeActions<T>['toggleIsExpanded']>(
    (selection = 'all', isExpanded = undefined, isRevertable = false) => {
      if (!(allowsExpansion || isRevertable)) {
        return;
      }

      if (!isRevertable) {
        previousExpansionValuesRef.current = [];
      }

      function toggle({ key, value }: TreeNode<T>) {
        if (key === rootKey || !('nodes' in value)) {
          return;
        }

        if (isRevertable) {
          previousExpansionValuesRef.current.push({
            key,
            patch: { isExpanded: value.isExpanded },
          });
        }

        update(key, { isExpanded: isExpanded ?? !value.isExpanded });
      }

      if (selection === 'all') {
        return mapTree(tree, toggle);
      }

      mapTree(tree, (node) => {
        if (!selection.has(node.key)) {
          return;
        }

        toggle(node);
      });
    },
    [allowsExpansion, tree, rootKey, update],
  );

  const toggleIsSelected = useCallback<TreeActions<T>['toggleIsSelected']>(
    (selection = 'all', isSelected = undefined) => {
      if (
        selectionMode === 'none' ||
        (selectionMode === 'single' &&
          (selection === 'all' || selection.size > 1))
      ) {
        return;
      }

      const all = Object.values(lookup);

      let keys =
        selection === 'all' ? new Set(all.map(({ key }) => key)) : selection;

      if (isSelected != null) {
        keys = isSelected ? keys : new Set();

        list.setSelectedKeys(keys);

        return onSelectionChange?.(
          (selection === 'all' || keys.size === all.length) && isSelected
            ? 'all'
            : keys,
        );
      }

      keys = new Set([
        ...(selectionMode === 'multiple'
          ? [...list.selectedKeys].filter(
              (key) => !(selection as Set<Key>).has(key),
            )
          : []),
        ...[...keys].filter((key) => !list.selectedKeys.has(key)),
      ]);

      list.setSelectedKeys(keys);

      onSelectionChange?.(
        selection === 'all' && keys.size === all.length ? 'all' : keys,
      );
    },
    [selectionMode, lookup, list, onSelectionChange],
  );

  const toggleIsViewable = useCallback<TreeActions<T>['toggleIsViewable']>(
    (selection = 'all', isViewable = undefined) => {
      if (!allowsVisibility) {
        return;
      }

      if (selection === 'all') {
        return mapTree(tree, ({ key, value }) => {
          if (key === rootKey) {
            return;
          }

          update(key, {
            isViewable: isViewable ?? !value.isViewable,
          });
        });
      }

      mapTree(
        {
          key: rootKey,
          children: Array.from(selection).reduce(
            (acc, key) => toggleVisibility(acc, key, isViewable),
            tree.children,
          ),
        } as TreeNode<T>,
        ({ key, value }) => {
          if (key === rootKey) {
            return;
          }

          update(key, { isViewable: value.isViewable });
        },
      );
    },
    [allowsVisibility, tree, rootKey, update],
  );

  return useMemo(() => {
    const { items: _, selectedKeys, ...rest } = list;

    return {
      actions: {
        ...rest,
        getItem,
        revertIsExpanded,
        toggleIsExpanded,
        toggleIsSelected,
        toggleIsViewable,
        update,
      },
      allowsExpansion,
      allowsVisibility,
      lookup,
      selectedKeys,
      selectionMode,
      tree,
    };
  }, [
    list,
    allowsExpansion,
    allowsVisibility,
    lookup,
    selectionMode,
    tree,
    getItem,
    revertIsExpanded,
    toggleIsExpanded,
    toggleIsSelected,
    toggleIsViewable,
    update,
  ]);
}

import type { Key } from 'react-aria';
import type { TreeNode, TreeNodes } from '../../types';

export function getChildren<T>(node: TreeNodes<T>) {
  return 'nodes' in node ? node.nodes : [];
}

export function getKey<T>(node: TreeNodes<T>) {
  return node.id;
}

export function mapTree<T>(
  node: TreeNode<T>,
  callback: (node: TreeNode<T>) => TreeNode<T> | undefined | void,
): TreeNode<T> {
  let changed = false;

  const children = node.children.map((child) => {
    const update = mapTree(child, callback);

    if (update !== child) {
      changed = true;
    }

    return update;
  });

  if (changed) {
    node = {
      ...node,
      children,
    };
  }

  return callback(node) ?? node;
}

type VisibilityUpdateContext = {
  forceIsViewable: boolean;
  parent: {
    isViewable: boolean;
    isVisible: boolean;
  };
  toggle: Key[];
};

export function toggleVisibility<T>(
  nodes: TreeNode<T>[],
  target: Key = '',
  isViewable?: boolean,
): TreeNode<T>[] {
  const toggle: Key[] = [];

  let result = toggleVisibilityInternal(nodes, target, isViewable, {
    forceIsViewable: false,
    parent: { isViewable: true, isVisible: true },
    toggle,
  });

  while ((target = toggle.shift() ?? '')) {
    result = toggleVisibilityInternal(result, target, undefined, {
      forceIsViewable: false,
      parent: { isViewable: true, isVisible: true },
      toggle,
    });
  }

  return result;
}

function toggleVisibilityInternal<T>(
  nodes: TreeNode<T>[],
  target: Key,
  state: boolean | undefined,
  { forceIsViewable, parent, toggle }: VisibilityUpdateContext,
): TreeNode<T>[] {
  return nodes.map((node) => {
    const isViewable =
      forceIsViewable ||
      (target === node.key
        ? (state ?? !node.value.isViewable)
        : node.value.isViewable);

    const isVisible = parent.isVisible && isViewable;
    const willUpdateIsViewable = node.value.isViewable != isViewable;

    // Toggle on parent if child of inactive parent is toggled on
    if (
      node.parentKey &&
      willUpdateIsViewable &&
      isViewable &&
      !parent.isVisible
    ) {
      toggle.push(node.parentKey);
    }

    // Toggle off parent if last active child is toggled off
    if (
      node.parentKey &&
      willUpdateIsViewable &&
      !isViewable &&
      parent.isVisible &&
      areSiblingsUnviewable(nodes, node)
    ) {
      toggle.push(node.parentKey);
    }

    return {
      ...node,
      children: toggleVisibilityInternal(node.children, target, state, {
        // Toggle all children on if all are inactive and parent is toggled on
        forceIsViewable:
          forceIsViewable ||
          (willUpdateIsViewable &&
            !!isViewable &&
            areUnviewable(node.children)),
        parent: {
          isViewable: !!isViewable,
          isVisible: !!isVisible,
        },
        toggle,
      }),
      value: {
        ...node.value,
        isViewable,
        isVisible,
      },
    };
  });
}

function areUnviewable<T>(nodes: TreeNode<T>[]): boolean {
  return nodes.every(
    ({ children, value }) =>
      !value.isViewable && (!children.length || areUnviewable<T>(children)),
  );
}

function areSiblingsUnviewable<T>(nodes: TreeNode<T>[], node: TreeNode<T>) {
  return areUnviewable(nodes.filter((n) => n !== node));
}

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

import type { Key } from '@react-types/shared';
import type { TreeNode, TreeRef } from '../types';

export function assert(
  condition: boolean,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function toTree<T extends object>(treeRef: TreeRef<T>): TreeNode<T>[] {
  const { lookup, roots } = treeRef;

  const buildNode = (key: Key) => {
    const node = lookup.get(key);
    assert(node !== undefined, `Key of ${key} does not exist in tree`);

    const children = (node.children ?? []).reduce(
      (acc: TreeNode<T>[], child: TreeNode<T>) => {
        if (child.parentKey === key) {
          acc.push(buildNode(child.key));
        }
        return acc;
      },
      [],
    );

    return {
      ...node,
      children: children.length > 0 ? children : [],
    };
  };

  return roots.map((key: Key) => buildNode(key));
}

export function withDefaults<T>(node: TreeNode<T>): TreeNode<T> {
  return {
    isVisible: node.isVisible ?? false,
    isViewable: node.isVisible ?? false,
    isSelected: node.isSelected ?? false,
    isExpanded: node.isExpanded ?? false,
    isReadOnly: node.isReadOnly ?? false,
    children: [],
    ...node,
  };
}

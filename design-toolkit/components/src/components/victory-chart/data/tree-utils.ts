// __private-exports
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

import type { ChartData, ChartItem, ChartRow } from '.';

type Child = typeof CHILD;
type Parent = typeof PARENT;
type TreeNode<T extends Child | Parent> = {
  item: T extends Parent ? ChartRow : ChartItem[];
  parents: ChartData; // track the ancestry of the tree node
  type: T;
};

const MAX_TREE_DEPTH = 10;

const CHILD = 'child' as const;
const PARENT = 'parent' as const;

/**
 * Helper function for gathering a flattened list of only the "children";
 * elements that are not "parents".
 *
 * @param data - the source data list for the chart
 * @returns - all elements that are not "parents"
 */
export const getChildren = (data: ChartData) => walkTree(CHILD, data);

/**
 * Helper function for gathering a flattened list of only "parent" elements;
 * elements which have "children".
 *
 * @param data - the source data list for the chart
 * @returns - all elements that are "parents"
 */
export const getParents = (data: ChartData) => walkTree(PARENT, data);

// Flatten the tree into a list of TreeNodes
function flattenTree(
  data: ChartRow['data'],
  parents: ChartData = [],
): TreeNode<Child | Parent>[] {
  if (parents.length > MAX_TREE_DEPTH) {
    // Prevent recursing too deeply
    throw new Error(`Maximum tree depth of ${MAX_TREE_DEPTH} exceeded.`);
  }

  return data.flatMap((item) => {
    const isParent = isChartRow(item);
    const node: TreeNode<Child | Parent> = {
      item,
      parents,
      type: isParent ? PARENT : CHILD,
    };

    return isParent
      ? [node, ...flattenTree(item.data, [...parents, item])]
      : [node];
  });
}

export function isChartRow(item: unknown): item is ChartRow {
  return (
    typeof item === 'object' &&
    item !== null &&
    'data' in item &&
    Array.isArray((item as { data: (ChartItem[] | ChartRow)[] }).data)
  );
}

function walkTree<T extends Child | Parent>(
  type: T,
  data: ChartData,
): TreeNode<T>[] {
  return (
    flattenTree(data)
      // filter (effectively) for the desired tree node type while also properly type narrowing
      .flatMap((node) => (node.type === type ? [node as TreeNode<T>] : []))
  );
}

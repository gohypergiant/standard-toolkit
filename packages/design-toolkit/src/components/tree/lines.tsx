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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { memo, useContext } from 'react';
import { Lines } from '../lines';
import { TreeContext } from './context';
import styles from './styles.module.css';

/**
 * TreeLines - Renders connecting lines for tree hierarchy visualization.
 *
 * @param props - Component props.
 * @param props.level - The nesting level of the tree item.
 * @param props.isLastOfSet - Whether this item is the last in its sibling group.
 * @param props.ancestorLastOfSet - Array tracking which ancestors are last of set at each level.
 * @returns An array of Line components representing the tree structure.
 */
export const TreeLines = memo(function TreeLines({
  level,
  isLastOfSet,
  ancestorLastOfSet,
}: {
  level: number;
  isLastOfSet: boolean;
  ancestorLastOfSet: boolean[];
}) {
  const { showRuleLines, variant } = useContext(TreeContext);

  return Array.from({ length: level }).map((_, i) => {
    const type = i === level - 1 ? 'branch' : 'vert';
    const line = isLastOfSet && i === level - 1 ? 'last' : type;
    const size = variant === 'crammed' ? 'medium' : 'large';

    // Hide line at position i if the ancestor at that level is last of set
    const shouldHideLine = ancestorLastOfSet[i] ?? false;

    return (
      <Lines
        // biome-ignore lint/suspicious/noArrayIndexKey: index should be the key, only count matters
        key={i}
        variant={line}
        size={size}
        isVisible={showRuleLines && !shouldHideLine}
        className={clsx(styles.spacing, styles[variant])}
      />
    );
  });
});

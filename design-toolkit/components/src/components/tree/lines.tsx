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

import { memo, useContext } from 'react';
import { Lines } from '../lines';
import { TreeContext } from './context';
import { TreeStyles } from './styles';

const { spacing } = TreeStyles();

export const TreeLines = memo(function TreeLines({
  level,
  isLastOfSet,
}: {
  level: number;
  isLastOfSet: boolean;
}) {
  const { showRuleLines, variant } = useContext(TreeContext);

  return Array.from({ length: level }).map((_, i) => {
    const type = i === level - 1 ? 'branch' : 'vert';
    const line = isLastOfSet && i > 0 ? 'last' : type;
    const size = variant === 'crammed' ? 'medium' : 'large';

    return (
      <Lines
        // biome-ignore lint/suspicious/noArrayIndexKey: index should be the key, only count matters
        key={i}
        variant={line}
        size={size}
        isVisible={showRuleLines}
        className={spacing({ variant })}
      />
    );
  });
});

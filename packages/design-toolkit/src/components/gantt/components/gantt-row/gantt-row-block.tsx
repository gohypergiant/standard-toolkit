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

import { GANTT_ROW_ELEMENT_HEIGHT } from '../../constants';
import { useTemporalDataContext } from '../../context/temporal-data';
import { calculateElapsedPercentage } from '../../utils/helpers';
import { Range, type RangeProps } from '../base-elements/range';
import styles from './styles.module.css';

export function GanttRowBlock(props: RangeProps) {
  const { currentTimeMs, renderedRegionBounds } = useTemporalDataContext();

  let elapsedPct = 0;
  if (currentTimeMs !== undefined) {
    elapsedPct = calculateElapsedPercentage(
      currentTimeMs,
      Math.max(props.startMs, renderedRegionBounds.startMs),
      Math.min(props.endMs, renderedRegionBounds.endMs),
    );
  }

  return (
    <Range
      data-height={GANTT_ROW_ELEMENT_HEIGHT}
      data-elapsed-pct={elapsedPct}
      className={styles['row-block']}
      {...props}
    />
  );
}

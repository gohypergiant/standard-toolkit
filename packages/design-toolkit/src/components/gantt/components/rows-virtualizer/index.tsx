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

import { Children, type PropsWithChildren } from 'react';
import { useGanttContext } from '@/components/gantt/context';
import { useRootElementHeight } from '@/components/gantt/hooks/use-root-element-height';
import { useTotalDataRegionThresholds } from '@/components/gantt/hooks/use-total-data-region-thresholds';
import { GANTT_HEADER_HEIGHT_PX } from '../../constants';
import { useTemporalDataContext } from '../../context/temporal-data';
import styles from './styles.module.css';
import { useRenderedRows } from './use-rendered-rows';
import { useScrollSync } from './use-scroll-sync';

export function RowsVirtualizer({ children }: PropsWithChildren) {
  const { ganttContentElement } = useGanttContext();
  const { totalBounds, msPerPx } = useTemporalDataContext();

  const rootElementHeight = useRootElementHeight();

  const width = (totalBounds.endMs - totalBounds.startMs) / msPerPx;

  const { height, renderedRows } = useRenderedRows({
    children,
    heightPx: rootElementHeight - GANTT_HEADER_HEIGHT_PX,
  });

  useTotalDataRegionThresholds({
    totalRowsCount: Children.count(children),
    verticalScrollElement: ganttContentElement,
  });

  useScrollSync({
    horizontalScrollElement: ganttContentElement,
  });

  return (
    <div
      className={styles.container}
      data-height={rootElementHeight - GANTT_HEADER_HEIGHT_PX}
      data-width={width}
    >
      <div className={styles['inner-container']} data-height={height}>
        {renderedRows}
      </div>
    </div>
  );
}

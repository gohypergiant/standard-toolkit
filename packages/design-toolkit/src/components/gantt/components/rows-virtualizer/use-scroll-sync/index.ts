// __private-exports
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

import { useEffect } from 'react';
import { useGanttContext } from '@/components/gantt/context';
import { useGanttStoreApi } from '@/components/gantt/context/store';
import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';
import { timestampWithinBounds } from '@/components/gantt/utils/helpers';
import { deriveHorizontalScrollPosition } from '@/components/gantt/utils/layout';

type UseScrollSyncProps = {
  horizontalScrollElement: HTMLDivElement | null;
};

export function useScrollSync({ horizontalScrollElement }: UseScrollSyncProps) {
  const { ganttContentElement, ganttPanelElement, rootElement } =
    useGanttContext();
  const { totalBounds, msPerPx } = useTemporalDataContext();
  const store = useGanttStoreApi();

  useEffect(() => {
    if (!horizontalScrollElement) {
      return;
    }

    // Read imperatively to avoid re-triggering on scroll-driven position updates.
    // This effect should only run when the dataset changes (totalBounds) or
    // when another value changes that affects the effective scroll position
    // (like msPerPx which scales the timeline)
    const currentPositionMs = store.getState().currentPositionMs;
    const resetScrollPosition = () =>
      horizontalScrollElement.scrollTo({
        left: 0,
      });
    ganttContentElement?.scrollTo({ top: rootElement?.scrollTop ?? 0 });
    ganttPanelElement?.scrollTo({ top: rootElement?.scrollTop ?? 0 });

    const timestampOutsideDataRange = !timestampWithinBounds(
      currentPositionMs,
      totalBounds,
    );

    if (timestampOutsideDataRange) {
      resetScrollPosition();
      store.setState({ currentPositionMs: totalBounds.startMs });

      return;
    }

    const scrollPosition = deriveHorizontalScrollPosition(
      currentPositionMs,
      msPerPx,
      totalBounds,
    );

    horizontalScrollElement.scrollTo({
      left: scrollPosition,
    });
  }, [
    totalBounds,
    msPerPx,
    horizontalScrollElement,
    store,
    ganttContentElement,
    ganttPanelElement,
    rootElement,
  ]);
}

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
import { useGanttStore } from '@/components/gantt/store';
import { timestampWithinBounds } from '@/components/gantt/utils/helpers';
import { deriveHorizontalScrollPosition } from '@/components/gantt/utils/layout';

type UseScrollSyncProps = {
  scrollContainerElement: HTMLDivElement | null;
};

export function useScrollSync({ scrollContainerElement }: UseScrollSyncProps) {
  const { totalBounds, msPerPx } = useGanttContext();

  useEffect(() => {
    if (!scrollContainerElement) {
      return;
    }

    const currentPositionMs = useGanttStore.getState().currentPositionMs;
    const resetScrollPosition = () =>
      scrollContainerElement.scrollTo({
        top: 0,
        left: 0,
      });

    const timestampOutsideDataRange = !timestampWithinBounds(
      currentPositionMs,
      totalBounds,
    );

    if (timestampOutsideDataRange) {
      resetScrollPosition();

      return;
    }

    const scrollPosition = deriveHorizontalScrollPosition(
      currentPositionMs,
      msPerPx,
      totalBounds,
    );

    scrollContainerElement.scrollTo({
      left: scrollPosition,
    });
  }, [totalBounds, msPerPx, scrollContainerElement]);
}

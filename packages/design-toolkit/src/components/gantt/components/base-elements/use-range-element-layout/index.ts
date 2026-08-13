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

import { useCallback, useMemo } from 'react';
import { TIMESCALE_MAPPING } from '@/components/gantt/constants';
import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';
import { useLayoutSubscription } from '@/components/gantt/hooks/use-layout-subscription';
import { type GanttState, selectors } from '@/components/gantt/store';
import { deriveRangeElementLayout } from '@/components/gantt/utils/layout';
import type { GanttTimeBounds, GanttTimescale } from '@/components/gantt/types';

type UseRangeElementLayoutProps = {
  element: HTMLDivElement | null;
  timeBounds: GanttTimeBounds;
};

const storeSelector = (timescale: GanttTimescale) => (state: GanttState) => [
  selectors.roundedCurrentPositionMs(TIMESCALE_MAPPING[timescale])(state),
  selectors.roundedCurrentRowScrollPx(state),
];

export function useRangeElementLayout(props: UseRangeElementLayoutProps) {
  const { timeBounds, element } = props;
  const { startMs, endMs } = timeBounds;

  const { renderedRegionBounds, msPerPx, timescale, totalBounds } =
    useTemporalDataContext();

  const applyRangeElementLayout = useCallback(() => {
    if (!element) {
      return;
    }

    const { widthPx, translateX } = deriveRangeElementLayout(
      renderedRegionBounds,
      { startMs, endMs },
      totalBounds,
      msPerPx,
    );

    element.style.width = `${widthPx}px`;
    element.style.transform = `translateX(${translateX}px)`;
  }, [element, renderedRegionBounds, startMs, endMs, totalBounds, msPerPx]);

  const selector = useMemo(() => storeSelector(timescale), [timescale]);

  useLayoutSubscription({
    callback: applyRangeElementLayout,
    selector,
  });
}

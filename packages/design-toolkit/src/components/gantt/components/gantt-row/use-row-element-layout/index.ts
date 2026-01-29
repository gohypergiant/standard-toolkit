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
import { TIMESCALE_MAPPING } from '../../../constants';
import { useGanttContext } from '../../../context';
import { useLayoutSubscription } from '../../../hooks/use-layout-subscription';
import { type GanttState, selectors } from '../../../store';
import { deriveRangeElementLayout } from '../../../utils/layout';
import type { TimeBounds, Timescale } from '../../../types';

type UseRowElementLayoutProps = {
  element: HTMLDivElement | null;
  timeBounds: TimeBounds;
};

const storeSelector = (timescale: Timescale) => (state: GanttState) => [
  selectors.roundedCurrentPositionMs(TIMESCALE_MAPPING[timescale])(state),
  selectors.roundedCurrentRowScrollPx(state),
];

export function useRowElementLayout(props: UseRowElementLayoutProps) {
  const { timeBounds, element } = props;

  const { renderedRegionBounds, msPerPx, timescale, totalBounds } =
    useGanttContext();

  const applyRowElementLayout = useCallback(() => {
    if (!element) {
      return;
    }

    const { widthPx, translateX } = deriveRangeElementLayout(
      renderedRegionBounds,
      timeBounds,
      totalBounds,
      msPerPx,
    );

    element.style.width = `${widthPx}px`;
    element.style.transform = `translateX(${translateX}px)`;
  }, [element, renderedRegionBounds, timeBounds, totalBounds, msPerPx]);

  const selector = useMemo(() => storeSelector(timescale), [timescale]);

  useLayoutSubscription({
    callback: applyRowElementLayout,
    selector,
  });
}

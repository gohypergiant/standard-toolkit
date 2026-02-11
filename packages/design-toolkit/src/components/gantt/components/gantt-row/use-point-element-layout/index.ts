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

import { useCallback } from 'react';
import { TIMESCALE_MAPPING } from '@/components/gantt/constants';
import { useLayoutSubscription } from '@/components/gantt/hooks/use-layout-subscription';
import { selectors } from '@/components/gantt/store';
import { derivePointElementLayout } from '@/components/gantt/utils/layout';
import { useGanttContext } from '../../../context';

type UsePointElementLayoutProps = {
  element: HTMLDivElement | null;
  timeMs: number;
};

export function usePointElementLayout({
  element,
  timeMs,
}: UsePointElementLayoutProps) {
  const { renderedRegionBounds, msPerPx, timescale, totalBounds } =
    useGanttContext();

  const applyLayout = useCallback(() => {
    if (!element) {
      return;
    }

    const { translateX } = derivePointElementLayout(
      renderedRegionBounds,
      timeMs,
      totalBounds,
      msPerPx,
    );

    element.style.setProperty('--translate-x', `${translateX}px`);
  }, [element, renderedRegionBounds, timeMs, totalBounds, msPerPx]);

  useLayoutSubscription({
    callback: applyLayout,
    selector: selectors.roundedCurrentPositionMs(TIMESCALE_MAPPING[timescale]),
  });
}

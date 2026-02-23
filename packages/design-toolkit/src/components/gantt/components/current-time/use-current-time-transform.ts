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
import { useLayoutSubscription } from '@/components/gantt/hooks/use-layout-subscription';
import { selectors } from '@/components/gantt/store';
import { deriveCurrentTimeTranslateX } from '@/components/gantt/utils/layout';
import { useGanttContext } from '../../context';

type UseCurrentTimeTransformProps = {
  currentTimeElement: HTMLDivElement | null;
  currentTimeMs: number;
  indicatorElement: HTMLDivElement | null;
  indicatorHeightOffset: number;
};

export function useCurrentTimeTransform({
  currentTimeElement,
  currentTimeMs,
  indicatorElement,
  indicatorHeightOffset,
}: UseCurrentTimeTransformProps) {
  const { renderedRegionBounds, msPerPx, scrollContainerElement } =
    useGanttContext();
  const updateElementTranslateX = useCallback(
    (currentPositionMs: number) => {
      if (!currentTimeElement) {
        return;
      }

      const translateX = deriveCurrentTimeTranslateX(
        renderedRegionBounds,
        currentTimeMs,
        msPerPx,
        currentPositionMs,
      );
      if (scrollContainerElement && indicatorElement) {
        if (translateX >= scrollContainerElement.clientWidth) {
          indicatorElement.style.height = `${indicatorHeightOffset}px`;
        } else {
          indicatorElement.style.height = '';
        }
      }

      currentTimeElement.style.transform = `translateX(${translateX}px)`;
    },
    [
      currentTimeElement,
      renderedRegionBounds,
      msPerPx,
      currentTimeMs,
      indicatorElement,
      indicatorHeightOffset,
      scrollContainerElement,
    ],
  );

  useLayoutSubscription({
    callback: updateElementTranslateX,
    selector: selectors.currentPositionMs,
  });
}

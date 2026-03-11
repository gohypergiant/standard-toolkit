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

import { type RefObject, useCallback, useRef } from 'react';
import {
  GANTT_CONTAINER_TOP_PADDING_PX,
  GANTT_CONTAINER_TOP_PX,
} from '@/components/gantt/constants';
import { useGanttContext } from '@/components/gantt/context';
import { useLayoutSubscription } from '@/components/gantt/hooks/use-layout-subscription';
import { selectors } from '@/components/gantt/store';
import { deriveCurrentTimeTranslateX } from '@/components/gantt/utils/layout';

type UseCurrentTimeLayoutProps = {
  currentTimeElement: HTMLDivElement | null;
  currentTimeMs: number;
  indicatorElement: HTMLDivElement | null;
};

type UseCurrentTimeLayoutValue = {
  labelElementRef: RefObject<HTMLDivElement | null>;
};

function calculateIndicatorHeight(
  timelineContainerElement: HTMLDivElement | null,
  labelElement: HTMLDivElement | null,
  scrollContainerElement: HTMLDivElement | null,
  translateX = 0,
) {
  const timelineHeight = timelineContainerElement?.clientHeight ?? 0;
  const scrollWidth = scrollContainerElement?.clientWidth ?? 0;
  const scrollHeight = scrollContainerElement?.clientHeight ?? 0;
  const labelHeight = labelElement?.offsetHeight ?? 0;

  const ganttHeaderHeight = timelineHeight + GANTT_CONTAINER_TOP_PADDING_PX;

  // Distance between vertical scrollbar and bottom of label element.
  // Used as the indicator height when the indicator is visually
  // located above the vertical scrollbar so that the indicator
  // dashes aren't overlaid on the scrollbar
  const indicatorHeightOffset =
    ganttHeaderHeight - (GANTT_CONTAINER_TOP_PX + labelHeight);

  // Default indicator height when the indicator is not
  // visually located above the vertical scrollbar.
  const totalIndicatorHeight = scrollHeight + indicatorHeightOffset;

  return translateX >= scrollWidth
    ? indicatorHeightOffset
    : totalIndicatorHeight;
}

export function useCurrentTimeLayout({
  currentTimeElement,
  currentTimeMs,
  indicatorElement,
}: UseCurrentTimeLayoutProps): UseCurrentTimeLayoutValue {
  const { msPerPx, scrollContainerElement, timelineContainerElement } =
    useGanttContext();

  const labelElementRef = useRef<HTMLDivElement>(null);

  const updateElementLayout = useCallback(
    (currentPositionMs: number) => {
      if (!currentTimeElement) {
        return;
      }

      const translateX = deriveCurrentTimeTranslateX(
        currentTimeMs,
        msPerPx,
        currentPositionMs,
      );
      const indicatorHeight = calculateIndicatorHeight(
        timelineContainerElement,
        labelElementRef.current,
        scrollContainerElement,
        translateX,
      );

      currentTimeElement.style.setProperty('--translate-x', `${translateX}px`);

      if (indicatorElement) {
        indicatorElement.style.height = `${indicatorHeight}px`;
      }
    },
    [
      currentTimeElement,
      msPerPx,
      currentTimeMs,
      indicatorElement,
      timelineContainerElement,
      scrollContainerElement,
    ],
  );

  useLayoutSubscription({
    callback: updateElementLayout,
    selector: selectors.currentPositionMs,
  });

  return { labelElementRef };
}

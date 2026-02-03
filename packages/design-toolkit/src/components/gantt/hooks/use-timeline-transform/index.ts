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

import { useCallback, useEffect } from 'react';
import { useGanttStore } from '../../store';
import { deriveTranslateXValue } from '../../utils/layout';
import type { TimeMarkerObject } from '../../types';

type UseTimelineTransformProps = {
  timelineElement: HTMLDivElement | null;
  msPerPx: number;
  timeMarkers: TimeMarkerObject[];
};

export function useTimelineTransform({
  timelineElement,
  msPerPx,
  timeMarkers,
}: UseTimelineTransformProps) {
  const updateElementTranslateX = useCallback(
    (currentPositionMs: number) => {
      if (!timelineElement) {
        return;
      }

      const translateX = deriveTranslateXValue(
        msPerPx,
        timeMarkers,
        currentPositionMs,
      );

      timelineElement.style.transform = `translateX(${translateX}px)`;
    },
    [timelineElement, msPerPx, timeMarkers],
  );

  useEffect(() => {
    let animationFrameId: number;

    // Update translate-x value as soon as this effect runs. If a
    // timestamp change causes a re-render to occur, we want a new
    // translate-x value to be immediately recalculated following
    // a browser paint of newly generated array of timeline chunks.
    // Prevents a timeline position flicker issue because of a
    // translate-x calculation based on a stale array of objects.
    animationFrameId = requestAnimationFrame(() => {
      updateElementTranslateX(useGanttStore.getState().currentPositionMs);
    });

    const unsubscribe = useGanttStore.subscribe((state) => {
      animationFrameId = requestAnimationFrame(() => {
        // Update/recalculate translate-x of timeline whenever the
        // timestamp is changed.
        updateElementTranslateX(state.currentPositionMs);
      });
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      unsubscribe();
    };
  }, [updateElementTranslateX]);
}

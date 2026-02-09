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

import { type RefObject, useCallback } from 'react';
import { useLayoutSubscription } from '../../../hooks/use-layout-subscription';
import { deriveTranslateXValue } from '../../../utils/layout';
import type { TimelineChunkObject } from '../../../types';

type UseTimelineTransformProps = {
  timelineElementRef: RefObject<HTMLDivElement | null>;
  msPerPx: number;
  timelineChunks: TimelineChunkObject[];
};

export function useTimelineTransform({
  timelineElementRef,
  msPerPx,
  timelineChunks,
}: UseTimelineTransformProps) {
  const updateElementTranslateX = useCallback(
    (currentPositionMs: number) => {
      if (!timelineElementRef.current) {
        return;
      }

      const translateX = deriveTranslateXValue(
        msPerPx,
        timelineChunks,
        currentPositionMs,
      );

      timelineElementRef.current.style.transform = `translateX(${translateX}px)`;
    },
    [timelineElementRef.current, msPerPx, timelineChunks],
  );

  useLayoutSubscription({
    callback: updateElementTranslateX,
    selector: (state) => state.currentPositionMs,
  });
}

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

import { useEffect, useReducer } from 'react';
import type { TimelineChunkObject } from '../../types';

type UseResizeEffectProps = {
  timelineContainerElement: HTMLDivElement | null;
  timelineChunks: TimelineChunkObject[];
};

function getResizeElementsToObserve(
  timelineChunks: TimelineChunkObject[],
  timelineContainerElement: HTMLDivElement,
): [Element | null, Element | null] {
  const expansionThresholdChunk = timelineChunks[timelineChunks.length - 1];
  const contractionThresholdChunk = timelineChunks[timelineChunks.length - 3];

  const expansionThresholdElement = timelineContainerElement.querySelector(
    `[data-timestamp="${expansionThresholdChunk?.timestampMs}"]`,
  );
  const contractionThresholdElement = timelineContainerElement.querySelector(
    `[data-timestamp="${contractionThresholdChunk?.timestampMs}"]`,
  );

  return [expansionThresholdElement, contractionThresholdElement];
}

export function useResizeIntersectionEffect({
  timelineContainerElement,
  timelineChunks,
}: UseResizeEffectProps) {
  const [, bumpLayoutTick] = useReducer((prev) => prev + 1, 0);

  useEffect(() => {
    if (!timelineContainerElement) {
      return;
    }

    const [expansionElement, contractionElement] = getResizeElementsToObserve(
      timelineChunks,
      timelineContainerElement,
    );

    const bothElementsDefined = expansionElement && contractionElement;

    if (!bothElementsDefined) {
      return;
    }

    const intersectionObserverOptions: IntersectionObserverInit = {
      root: timelineContainerElement,
      threshold: 0,
    };

    // IntersectionObserver fires an initial callback on observe(). This does not
    // cause a loop because a bump re-renders with the new container width,
    // producing new chunks whose expansion element is offscreen (not intersecting)
    // and whose contraction element is onscreen (intersecting) — neither condition
    // triggers another bump.
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const isExpansionElement = entry.target === expansionElement;
        const isContractionElement = entry.target === contractionElement;

        const shouldBumpLayoutTick =
          (isExpansionElement && entry.isIntersecting) ||
          (isContractionElement && !entry.isIntersecting);

        if (shouldBumpLayoutTick) {
          bumpLayoutTick();
        }
      }
    }, intersectionObserverOptions);

    intersectionObserver.observe(expansionElement);
    intersectionObserver.observe(contractionElement);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [timelineContainerElement, timelineChunks]);
}

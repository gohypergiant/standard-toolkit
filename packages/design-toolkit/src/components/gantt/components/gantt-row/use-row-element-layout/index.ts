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
import { useGanttContext } from '../../../context';
import { useLayoutSubscription } from '../../../hooks/use-layout-subscription';
import { deriveRangeElementLayout } from '../../../utils/layout';

type UseRowElementLayoutProps = {
  elementRef: React.RefObject<HTMLDivElement | null>;
  startMs: number;
  endMs: number;
};

export function useRowElementLayout(props: UseRowElementLayoutProps) {
  const { elementRef, startMs, endMs } = props;

  const { renderedRegionBoundary, msPerPx } = useGanttContext();

  const updateElementLayout = useCallback(
    (currentPositionMs: number) => {
      if (!elementRef.current) {
        return;
      }

      const { translateX, widthPx } = deriveRangeElementLayout(
        renderedRegionBoundary,
        { startMs, endMs },
        msPerPx,
        currentPositionMs,
      );

      elementRef.current.style.transform = `translateX(${translateX}px)`;
      elementRef.current.style.width = `${widthPx}px`;
    },
    [elementRef.current, msPerPx, renderedRegionBoundary, startMs, endMs],
  );

  useLayoutSubscription({ callback: updateElementLayout });
}

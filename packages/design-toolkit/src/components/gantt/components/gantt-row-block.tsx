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

import { useCallback, useEffect, useRef } from 'react';
import { GANTT_ROW_HEIGHT_PX } from '../constants';
import { useGanttContext } from '../context';
import { useGanttStore } from '../store';
import { formatBlockDisplay } from '../utils/helpers';

export type GanttRowBlockProps = {
  id: string;
  startMs: number;
  endMs: number;
};

export function GanttRowBlock(props: GanttRowBlockProps) {
  const { startMs, endMs } = props;
  const { renderedRegionBoundary, msPerPx } = useGanttContext();
  const blockRef = useRef<HTMLDivElement>(null);
  const updateElementLayout = useCallback(
    (currentPositionMs: number) => {
      if (!blockRef.current) {
        return;
      }

      const { leftPx, widthPx } = formatBlockDisplay(
        renderedRegionBoundary,
        { startMs, endMs },
        msPerPx,
        currentPositionMs,
      );

      blockRef.current.style.left = `${leftPx}px`;
      blockRef.current.style.width = `${widthPx}px`;
    },
    [msPerPx, renderedRegionBoundary, startMs, endMs],
  );

  useEffect(() => {
    let animationFrameId: number;

    animationFrameId = requestAnimationFrame(() => {
      updateElementLayout(useGanttStore.getState().currentPositionMs);
    });

    const unsubscribe = useGanttStore.subscribe((state) => {
      animationFrameId = requestAnimationFrame(() => {
        // Update/recalculate translate-x of timeline whenever the
        // timestamp is changed.
        updateElementLayout(state.currentPositionMs);
      });
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      unsubscribe();
    };
  }, [updateElementLayout]);

  return (
    <div
      style={{
        position: 'absolute',
        height: GANTT_ROW_HEIGHT_PX,
        background: 'red',
      }}
      ref={blockRef}
    />
  );
}

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

import { useRef, useState } from 'react';
import {
  GANTT_CONTAINER_TOP_PADDING_PX,
  GANTT_CONTAINER_TOP_PX,
} from '../../constants';
import { useGanttContext } from '../../context';
import { formatTimestampLabel } from '../../utils/formatting';
import styles from './styles.module.css';
import { useCurrentTimeTransform } from './use-current-time-transform';

function shouldRenderCurrentTime(
  currentTimeMs: number,
  renderedRegionBounds: {
    startMs: number;
    endMs: number;
  },
) {
  return (
    currentTimeMs >= renderedRegionBounds.startMs &&
    currentTimeMs <= renderedRegionBounds.endMs
  );
}

function useDisplayCurrentTime(currentTimeMs: number) {
  const { renderedRegionBounds } = useGanttContext();

  return shouldRenderCurrentTime(currentTimeMs, renderedRegionBounds);
}

function CurrentTimeInner({ currentTimeMs }: { currentTimeMs: number }) {
  const { scrollContainerElement, timelineContainerElement } =
    useGanttContext();
  const scrollbarHeight =
    (scrollContainerElement?.offsetHeight ?? 0) -
      (scrollContainerElement?.clientHeight ?? 0) || 0;
  console.log(scrollbarHeight);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const indicatorElementRef = useRef<HTMLDivElement>(null);
  const labelElementRef = useRef<HTMLDivElement>(null);

  const timelineHeight = timelineContainerElement?.clientHeight ?? 0;
  const labelHeight = labelElementRef.current?.clientHeight ?? 0;
  const containerHeight = timelineHeight + GANTT_CONTAINER_TOP_PADDING_PX;
  const indicatorHeightOffset =
    containerHeight - (GANTT_CONTAINER_TOP_PX + labelHeight);
  const totalIndicatorHeight =
    (scrollContainerElement?.clientHeight ?? 0) + indicatorHeightOffset;

  useCurrentTimeTransform({
    currentTimeElement: element,
    currentTimeMs,
    indicatorElement: indicatorElementRef.current,
    indicatorHeightOffset,
  });

  const assignElementRef = (node: HTMLDivElement) => {
    setElement(node);
  };

  return (
    <div
      ref={assignElementRef}
      className={styles['current-time-marker']}
      data-top={GANTT_CONTAINER_TOP_PX}
    >
      <div ref={labelElementRef} className={styles['current-time-label']}>
        {formatTimestampLabel(currentTimeMs)}
      </div>
      <div
        ref={indicatorElementRef}
        className={styles['current-time-indicator']}
        data-height={totalIndicatorHeight}
      />
    </div>
  );
}

export function CurrentTime({ currentTimeMs }: { currentTimeMs: number }) {
  const shouldDisplayCurrentTime = useDisplayCurrentTime(currentTimeMs);

  return shouldDisplayCurrentTime ? (
    <CurrentTimeInner currentTimeMs={currentTimeMs} />
  ) : null;
}

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
import { TIMESCALE_MAPPING } from '../constants';
import { useTimelineTransform } from '../hooks/use-timeline-transform';
import { selectors, useGanttStore } from '../store';
import { formatTimestampLabel } from '../utils/formatting';
import { generateTimelineChunks } from '../utils/generation';
import { getViewableRegionWidth } from '../utils/helpers';
import { TimelineChunk } from './timeline-chunk';
import type { Timescale } from '../types';

type TimelineProps = {
  msPerPx: number;
  timescale: Timescale;
};

export function Timeline({ msPerPx, timescale }: TimelineProps) {
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const timelineElementRef = useRef<HTMLDivElement | null>(null);

  const selectedTimeIntervalMs = TIMESCALE_MAPPING[timescale];
  const roundedTimestampMs = useGanttStore(
    selectors.roundedCurrentPositionMs(selectedTimeIntervalMs),
  );

  const timelineChunks = generateTimelineChunks(
    roundedTimestampMs,
    getViewableRegionWidth(containerElement),
    selectedTimeIntervalMs,
    msPerPx,
  );

  const assignRef = (node: HTMLDivElement) => {
    if (!node) {
      return;
    }

    setContainerElement(node);
  };

  useTimelineTransform({
    timelineElement: timelineElementRef.current,
    msPerPx,
    timelineChunks,
  });

  return (
    <div ref={assignRef}>
      <div ref={timelineElementRef} className='flex'>
        {timelineChunks.map((chunk) => (
          <TimelineChunk
            key={chunk.timestampMs}
            label={formatTimestampLabel(chunk.timestampMs)}
          />
        ))}
      </div>
    </div>
  );
}

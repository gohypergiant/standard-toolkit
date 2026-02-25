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

import { useRef } from 'react';
import { useGanttContext } from '../../context';
import { formatTimestampLabel } from '../../utils/formatting';
import styles from '../styles.module.css';
import { TimelineChunk } from '../timeline-chunk';
import { useTimelineTransform } from './use-timeline-transform';

export function Timeline() {
  const { assignTimelineContainerElementRef, msPerPx, timelineChunks } =
    useGanttContext();
  const timelineElementRef = useRef<HTMLDivElement | null>(null);

  useTimelineTransform({
    timelineElementRef: timelineElementRef,
    msPerPx,
    timelineChunks,
  });

  return (
    <div ref={assignTimelineContainerElementRef}>
      <div ref={timelineElementRef} className={styles.timeline}>
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

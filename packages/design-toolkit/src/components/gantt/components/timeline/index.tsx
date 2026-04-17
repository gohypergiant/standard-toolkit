// __private-exports
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
import { TimelineChunk } from '@/components/gantt/components/timeline-chunk';
import { useGanttContext } from '@/components/gantt/context';
import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';
import styles from '../styles.module.css';
import { useTimelineTransform } from './use-timeline-transform';

export function Timeline() {
  const { assignTimelineContainerElementRef } = useGanttContext();
  const { msPerPx, timelineChunks } = useTemporalDataContext();
  const timelineElementRef = useRef<HTMLDivElement | null>(null);

  useTimelineTransform({
    timelineElementRef: timelineElementRef,
    msPerPx,
    timelineChunks,
  });

  return (
    <div
      ref={assignTimelineContainerElementRef}
      className={styles['timeline-container']}
    >
      <div ref={timelineElementRef} className={styles.timeline}>
        {timelineChunks.map((chunk) => (
          <TimelineChunk
            key={chunk.timestampMs}
            timestampMs={chunk.timestampMs}
          />
        ))}
      </div>
    </div>
  );
}

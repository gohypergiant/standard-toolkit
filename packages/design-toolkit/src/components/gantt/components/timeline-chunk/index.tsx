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

import { TIMELINE_CHUNK_WIDTH } from '../../constants';
import styles from '../styles.module.css';
import type { CSSProperties } from 'react';

export function Tick() {
  return (
    <div className={styles['chunk-tick-container']}>
      <span className={styles['chunk-tick']} />
    </div>
  );
}

type TimelineChunkProps = {
  label: string;
};

export function TimelineChunk({ label }: TimelineChunkProps) {
  return (
    <div
      className={styles.chunk}
      style={
        { '--tick-chunk-width': `${TIMELINE_CHUNK_WIDTH}px` } as CSSProperties
      }
    >
      <div
        className={styles['chunk-label']}
        style={
          {
            '--tick-margin': `-${TIMELINE_CHUNK_WIDTH / 4 - 2.5}px`,
          } as CSSProperties
        }
      >
        {label}
      </div>
      <div className={styles['chunk-ticks-container']}>
        <Tick />
        <Tick />
      </div>
    </div>
  );
}

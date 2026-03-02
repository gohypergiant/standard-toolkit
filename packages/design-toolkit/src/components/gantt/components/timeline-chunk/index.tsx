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
  const tickMarginOffset = -(TIMELINE_CHUNK_WIDTH / 4 + 1.5);

  return (
    <div className={styles.chunk} data-width={TIMELINE_CHUNK_WIDTH}>
      <div
        className={styles['chunk-label']}
        data-tick-margin={tickMarginOffset}
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

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

import { Seeker } from './components/seeker';
import { Timeline } from './components/timeline';
import { GanttProvider } from './context';
import { useGanttInit } from './hooks/use-gantt-init';
import styles from './styles.module.css';
import type { Timescale } from './types';

type GanttProps = {
  startTimeMs: number;
  endTimeMs: number;
  timescale: Timescale;
};

export function Gantt({ startTimeMs, endTimeMs, timescale }: GanttProps) {
  useGanttInit(startTimeMs);

  return (
    <div className={styles.container}>
      <GanttProvider timescale={timescale}>
        <Timeline />
        {/* Render Rows */}
        <Seeker startTimeMs={startTimeMs} endTimeMs={endTimeMs} />
      </GanttProvider>
    </div>
  );
}

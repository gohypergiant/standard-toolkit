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

import { useGanttContext } from '../context';
import { useGanttStore } from '../store';
import {
  getTotalTimelineMs,
  getTotalTimelineWidth,
} from '../utils/conversions';
import { getHorizontalScrolledPixels } from '../utils/helpers';
import styles from './styles.module.css';
import type { UIEvent } from 'react';

type SeekerProps = {
  startTimeMs: number;
  endTimeMs: number;
};

const updateCurrentPositionMs =
  (startTimeMs: number, msPerPx: number) => (event: UIEvent<HTMLDivElement>) =>
    useGanttStore
      .getState()
      .setCurrentPositionMs(
        startTimeMs + getHorizontalScrolledPixels(event) * msPerPx,
      );

export function Seeker({ startTimeMs, endTimeMs }: SeekerProps) {
  const { msPerPx } = useGanttContext();

  const width = getTotalTimelineWidth(
    getTotalTimelineMs(startTimeMs, endTimeMs),
    msPerPx,
  );

  return (
    <div
      onScroll={updateCurrentPositionMs(startTimeMs, msPerPx)}
      className={styles['seeker-container']}
    >
      <div className={styles.seeker} style={{ width }} />
    </div>
  );
}

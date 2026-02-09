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

import React from 'react';
import { Seeker } from './components/seeker';
import { Timeline } from './components/timeline';
import { GANTT_ROW_HEIGHT_PX } from './constants';
import { GanttProvider } from './context';
import { useGanttInit } from './hooks/use-gantt-init';
import { useLayoutSubscription } from './hooks/use-layout-subscription';
import { useVirtualizedRows } from './hooks/use-virtualized-rows';
import { useGanttStore } from './store';
import styles from './styles.module.css';
import { getVerticalScrolledPixels } from './utils/helpers';
import type { PropsWithChildren, UIEvent } from 'react';
import type { Timescale } from './types';

const updateCurrentScrollPx = (event: UIEvent<HTMLDivElement>) =>
  useGanttStore
    .getState()
    .setCurrentRowScrollPx(getVerticalScrolledPixels(event));

function deriveTranslateYValue(currentScrollPx: number) {
  return currentScrollPx % GANTT_ROW_HEIGHT_PX;
}

type GanttProps = {
  startTimeMs: number;
  endTimeMs: number;
  timescale: Timescale;
};

export function Gantt({
  startTimeMs,
  endTimeMs,
  timescale,
  children,
}: PropsWithChildren<GanttProps>) {
  const rowDisplayRef = React.useRef<HTMLDivElement>(null);
  const [rowContainerElement, setRowContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  useGanttInit(startTimeMs);

  const rows = React.Children.toArray(children);

  const applyTranslateY = (currentScrollPx: number) => {
    if (!rowDisplayRef.current) {
      return;
    }

    const translateY = deriveTranslateYValue(currentScrollPx);
    rowDisplayRef.current.style.transform = `translateY(-${translateY}px)`;
  };

  useLayoutSubscription({
    callback: applyTranslateY,
    selector: (state) => state.currentRowScrollPx,
  });

  const { totalHeightPx, renderedIndices } = useVirtualizedRows({
    rowContainer: rowContainerElement,
    rowCount: rows.length,
  });

  const assignRowContainerElementRef = (element: HTMLDivElement | null) => {
    setRowContainerElement(element);
  };

  const renderedRows = rows.slice(renderedIndices.start, renderedIndices.end);

  return (
    <div className={styles.container}>
      <GanttProvider timescale={timescale}>
        <Timeline />
        <div className='flex'>
          <div
            ref={assignRowContainerElementRef}
            className={styles['rows-container']}
            style={{
              height: 130,
              maxHeight: 130,
              overflowY: 'hidden',
            }}
          >
            <div ref={rowDisplayRef}>{renderedRows}</div>
          </div>
          <div
            onScroll={updateCurrentScrollPx}
            className={styles['row-scroll-container']}
            style={{ height: 130, maxHeight: 130 }}
          >
            <div style={{ height: totalHeightPx }} />
          </div>
        </div>
        <Seeker startTimeMs={startTimeMs} endTimeMs={endTimeMs} />
      </GanttProvider>
    </div>
  );
}

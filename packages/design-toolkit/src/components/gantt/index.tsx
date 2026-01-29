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

import { type UIEvent, useRef, useState } from 'react';
import { TimeMarker } from './components/time-marker';
import { TIME_MARKER_WIDTH, TIMESCALE_MAPPING } from './constants';
import { useGanttInit } from './hooks/use-gantt-init';
import { useTimelineTransform } from './hooks/use-timeline-transform';
import { selectors, useGanttStore } from './store';
import { roundDateToInterval } from './utils';
import type { TimeMarkerObject, Timescale } from './types';

type GanttProps = {
  startTimeMs: number;
  endTimeMs: number;
  timescale: Timescale;
};

function getMsPerPx(timelineChunkPx: number, timescale: Timescale) {
  return TIMESCALE_MAPPING[timescale] / timelineChunkPx;
}

function getTotalTimelineMs(startTimeMs: number, endTimeMs: number) {
  return endTimeMs - startTimeMs;
}

function getTotalTimelineWidth(totalTimelineMs: number, msPerPx: number) {
  return totalTimelineMs / msPerPx;
}

function getScrolledPixels(event: UIEvent<HTMLDivElement>) {
  const { currentTarget } = event;

  return currentTarget.scrollLeft;
}

const updateCurrentPositionMs =
  (startTimeMs: number, msPerPx: number) => (event: UIEvent<HTMLDivElement>) =>
    useGanttStore
      .getState()
      .setCurrentPositionMs(startTimeMs + getScrolledPixels(event) * msPerPx);

function formatTimestampLabel(timestampMs: number) {
  const date = new Date(timestampMs);

  return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}

function getViewableRegionWidth(element: HTMLElement | null) {
  if (!element) {
    return 0;
  }

  return element.clientWidth;
}

function getMsRepresentedInViewableRegion(
  viewableRegionWidth: number,
  msPerPx: number,
) {
  return viewableRegionWidth * msPerPx;
}

function generateTimeMarkers(
  currentPositionMs: number,
  viewableRegionWidth: number,
  selectedTimeIntervalMs: number,
  msPerPx: number,
): TimeMarkerObject[] {
  if (viewableRegionWidth === 0) {
    return [];
  }

  const offsetMs =
    getMsRepresentedInViewableRegion(viewableRegionWidth, msPerPx) / 2;

  const proposedMarkerCount =
    Math.ceil(viewableRegionWidth / TIME_MARKER_WIDTH) + 2;

  const markersInViewableRegion =
    proposedMarkerCount % 2 === 0
      ? proposedMarkerCount + 1
      : proposedMarkerCount;

  const midpointMs = currentPositionMs + offsetMs;
  const midpointIndex = Math.floor(markersInViewableRegion / 2);
  const msPerMarker = TIME_MARKER_WIDTH * msPerPx;

  const workerDate = new Date(midpointMs);
  roundDateToInterval(workerDate, selectedTimeIntervalMs);
  const roundedMidpointMs = workerDate.getTime();

  const markers: TimeMarkerObject[] = [];

  for (let i = 0; i < markersInViewableRegion; i++) {
    const markerTimestampMs =
      roundedMidpointMs + msPerMarker * (i - midpointIndex);

    markers.push({
      timestampMs: markerTimestampMs,
    });
  }

  return markers;
}

export function Gantt({ startTimeMs, endTimeMs, timescale }: GanttProps) {
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const timelineElementRef = useRef<HTMLDivElement | null>(null);
  useGanttInit(startTimeMs);
  const selectedTimeIntervalMs = TIMESCALE_MAPPING[timescale];
  const roundedTimestampMs = useGanttStore(
    selectors.roundedCurrentPositionMs(selectedTimeIntervalMs),
  );
  const msPerPx = getMsPerPx(TIME_MARKER_WIDTH, timescale);
  const width = getTotalTimelineWidth(
    getTotalTimelineMs(startTimeMs, endTimeMs),
    msPerPx,
  );

  const renderedMarkers = generateTimeMarkers(
    roundedTimestampMs,
    getViewableRegionWidth(containerElement),
    selectedTimeIntervalMs,
    msPerPx,
  );

  useTimelineTransform({
    timelineElement: timelineElementRef.current,
    msPerPx,
    timeMarkers: renderedMarkers,
  });

  const assignRef = (node: HTMLDivElement) => {
    if (!node) {
      return;
    }

    setContainerElement(node);
  };

  return (
    <div className='w-full overflow-hidden'>
      <div ref={assignRef}>
        <div ref={timelineElementRef} className='flex'>
          {renderedMarkers.map((marker) => (
            <TimeMarker
              key={marker.timestampMs}
              label={formatTimestampLabel(marker.timestampMs)}
            />
          ))}
        </div>
      </div>
      <div
        style={{ overflowX: 'scroll' }}
        onScroll={updateCurrentPositionMs(startTimeMs, msPerPx)}
        className='p-px'
      >
        <div style={{ width, overflowX: 'auto' }} />
      </div>
    </div>
  );
}

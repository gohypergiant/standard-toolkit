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

import { useEffect, useRef } from 'react';
import { useGanttStore } from '@/components/gantt/context/store';
import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';
import { selectors } from '@/components/gantt/store';
import { deriveRenderedSlice } from '@/components/gantt/utils/layout';
import {
  deriveRenderedRegion,
  deriveRowIndexThresholds,
  deriveTemporalThresholds,
  deriveTotalDataRegion,
  examineThresholds,
  shouldExamineThresholds,
} from '@/components/gantt/utils/thresholds';
import { useGanttContext } from '../../context';
import type { GanttMetThresholdData } from '@/components/gantt/types';

function toThresholdKey(item: GanttMetThresholdData): string {
  return `${item.axis}:${item.direction}:${item.value}`;
}

function createThresholdProjection() {
  const state = new Set<string>();

  function update(
    metThresholds: GanttMetThresholdData[],
  ): GanttMetThresholdData[] {
    const keys: string[] = [];
    const newlyEntered: GanttMetThresholdData[] = [];

    for (let i = 0; i < metThresholds.length; i++) {
      const key = toThresholdKey(metThresholds[i]);
      keys.push(key);
      if (!state.has(key)) {
        newlyEntered.push(metThresholds[i]);
      }
    }

    state.clear();
    for (const key of keys) {
      state.add(key);
    }

    return newlyEntered;
  }

  function reset() {
    state.clear();
  }

  return { update, reset };
}

type UseTotalDataRegionThresholdsProps = {
  totalRowsCount: number;
  verticalScrollElement: HTMLDivElement | null;
};

/**
 * A hook that notifies the Gantt component consumer when certain thresholds are
 * reached in the total data region currently being virtualized.
 *
 * This allows the consumer to perform actions when the rendered region reaches
 * certain thresholds (like fetching additional data to provide to the Gantt component).
 */
export function useTotalDataRegionThresholds({
  totalRowsCount,
  verticalScrollElement,
}: UseTotalDataRegionThresholdsProps) {
  const projectionRef = useRef<ReturnType<
    typeof createThresholdProjection
  > | null>(null);
  if (projectionRef.current === null) {
    projectionRef.current = createThresholdProjection();
  }

  const roundedCurrentRowScrollPx = useGanttStore(
    selectors.roundedCurrentRowScrollPx,
  );

  const {
    totalBounds,
    renderedRegionBounds,
    threshold,
    onThresholdMet,
    timescale,
  } = useTemporalDataContext();
  const { rowHeightPx } = useGanttContext();

  useEffect(() => {
    // Early return if threshold examination should not proceed
    if (
      // biome-ignore lint/complexity/useSimplifiedLogicExpression: <clear expression>
      !threshold ||
      !onThresholdMet ||
      !shouldExamineThresholds(totalRowsCount, verticalScrollElement, threshold)
    ) {
      projectionRef.current?.reset();
      return;
    }

    const totalDataRegion = deriveTotalDataRegion(totalRowsCount, totalBounds);

    const renderedSlice = deriveRenderedSlice(
      roundedCurrentRowScrollPx,
      rowHeightPx,
      verticalScrollElement?.clientHeight ?? 0,
    );

    const renderedRegion = deriveRenderedRegion(
      renderedSlice,
      renderedRegionBounds,
    );

    const temporalThresholds = deriveTemporalThresholds(
      threshold,
      totalDataRegion,
      timescale,
    );

    const rowIndexThresholds = deriveRowIndexThresholds(
      threshold,
      totalDataRegion,
    );

    const metThresholds = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );

    const newlyMet = projectionRef.current?.update(metThresholds) ?? [];

    if (newlyMet.length > 0) {
      onThresholdMet(newlyMet);
    }
  }, [
    totalRowsCount,
    totalBounds,
    renderedRegionBounds,
    threshold,
    onThresholdMet,
    timescale,
    roundedCurrentRowScrollPx,
    verticalScrollElement,
    rowHeightPx,
  ]);
}

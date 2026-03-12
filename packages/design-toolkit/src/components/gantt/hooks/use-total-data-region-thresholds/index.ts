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
import { useGanttContext } from '../../context';
import { selectors, useGanttStore } from '../../store';
import { deriveRenderedSlice } from '../../utils/layout';
import {
  deriveRenderedRegion,
  deriveRowIndexThresholds,
  deriveTemporalThresholds,
  deriveTotalDataRegion,
  examineThresholds,
  shouldExamineThresholds,
} from '../../utils/thresholds';
import type { MetThresholdData } from '../../types';

type ThresholdKey =
  | 'horizontal:start'
  | 'horizontal:end'
  | 'vertical:start'
  | 'vertical:end';

type ThresholdState = Record<ThresholdKey, boolean>;

function toThresholdKey(item: MetThresholdData): ThresholdKey {
  return `${item.axis}:${item.direction}`;
}

function createThresholdProjection() {
  const state: ThresholdState = {
    'horizontal:start': false,
    'horizontal:end': false,
    'vertical:start': false,
    'vertical:end': false,
  };

  function update(metThresholds: MetThresholdData[]): MetThresholdData[] {
    const nextKeys = new Set(metThresholds.map(toThresholdKey));

    const newlyEntered = metThresholds.filter(
      (item) => !state[toThresholdKey(item)],
    );

    for (const key of Object.keys(state) as ThresholdKey[]) {
      state[key] = nextKeys.has(key);
    }

    return newlyEntered;
  }

  return { update };
}

type UseTotalDataRegionThresholdsProps = {
  totalRowsCount: number;
  scrollContainerElement: HTMLDivElement | null;
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
  scrollContainerElement,
}: UseTotalDataRegionThresholdsProps) {
  const projectionRef = useRef(createThresholdProjection());

  const roundedCurrentRowScrollPx = useGanttStore(
    selectors.roundedCurrentRowScrollPx,
  );

  const {
    totalBounds,
    renderedRegionBounds,
    threshold,
    onThresholdMet,
    timescale,
  } = useGanttContext();

  useEffect(() => {
    // Early return if threshold examination should not proceed
    if (
      // biome-ignore lint/complexity/useSimplifiedLogicExpression: <clear NOR>
      !threshold ||
      !onThresholdMet ||
      !shouldExamineThresholds(
        totalRowsCount,
        scrollContainerElement,
        threshold,
      )
    ) {
      return;
    }

    const totalDataRegion = deriveTotalDataRegion(totalRowsCount, totalBounds);

    const renderedSlice = deriveRenderedSlice(
      roundedCurrentRowScrollPx,
      scrollContainerElement?.clientHeight ?? 0,
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

    const newlyMet = projectionRef.current.update(metThresholds);

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
    scrollContainerElement,
  ]);
}

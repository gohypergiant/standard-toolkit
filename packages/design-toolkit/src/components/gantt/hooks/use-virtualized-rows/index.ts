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

import { GANTT_ROW_HEIGHT_PX } from '../../constants';
import { selectors, useGanttStore } from '../../store';

type UseVirtualizedRowsProps = {
  rowContainer: HTMLDivElement | null;
  rowCount: number;
};

type UseVirtualizedRowsValue = {
  maxHeight: number;
  totalHeightPx: number;
  renderedIndices: {
    start: number;
    end: number;
  };
};

const BUFFERED_ROWS_COUNT = 2;

function deriveRenderedIndices(
  currentRoundedScrollPx: number,
  viewableRegionHeightPx: number,
) {
  const startIndex = currentRoundedScrollPx / GANTT_ROW_HEIGHT_PX;

  const viewableIndices = Math.ceil(
    viewableRegionHeightPx / GANTT_ROW_HEIGHT_PX,
  );

  const proposedRenderedIndicesCount = viewableIndices + BUFFERED_ROWS_COUNT;

  const indicesCountEven = proposedRenderedIndicesCount % 2 === 0;
  const indicesCount = indicesCountEven
    ? proposedRenderedIndicesCount + 1
    : proposedRenderedIndicesCount;

  return {
    start: startIndex,
    end: startIndex + indicesCount,
  };
}

export function useVirtualizedRows(
  props: UseVirtualizedRowsProps,
): UseVirtualizedRowsValue {
  const roundedCurrentScrollPx = useGanttStore(
    selectors.roundedCurrentRowScrollPx,
  );

  const { rowCount, rowContainer } = props;

  const containerViewableHeightPx = Math.max(rowContainer?.clientHeight ?? 0);

  const totalHeightPx = rowCount * GANTT_ROW_HEIGHT_PX;

  return {
    totalHeightPx,
    maxHeight: containerViewableHeightPx,
    renderedIndices: deriveRenderedIndices(
      roundedCurrentScrollPx,
      containerViewableHeightPx,
    ),
  };
}

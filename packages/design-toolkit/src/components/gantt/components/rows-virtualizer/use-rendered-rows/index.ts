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

import {
  Children,
  cloneElement,
  type JSX,
  type PropsWithChildren,
  type ReactElement,
  type UIEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { GANTT_ROW_HEIGHT_PX } from '../../../constants';
import { useGanttContext } from '../../../context';
import { selectors, useGanttStore } from '../../../store';
import {
  getHorizontalScrolledPixels,
  getVerticalScrolledPixels,
} from '../../../utils/helpers';
import { deriveRenderedSlice } from '../../../utils/layout';

type RowChild = ReactElement<JSX.IntrinsicElements['div']>;

const applyVirtualizedRowStyles =
  (startIndex: number) => (element: RowChild, index: number) =>
    cloneElement(element, {
      style: {
        ...element.props.style,
        position: 'absolute',
        transform: `translateY(${GANTT_ROW_HEIGHT_PX * (startIndex + index)}px)`,
        width: '100%',
      },
    });

type UseRenderedRowsValue = {
  dimensions: { height: number; width: number };
  renderedRows: ReactElement<JSX.IntrinsicElements['div']>[] | null;
  assignContainerRef: (element: HTMLDivElement | null) => void;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
};

export function useRenderedRows({
  children,
}: PropsWithChildren): UseRenderedRowsValue {
  const { totalBounds, msPerPx } = useGanttContext();
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const roundedCurrentRowScrollPx = useGanttStore(
    selectors.roundedCurrentRowScrollPx,
  );

  const updateRoundedScrollPx = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const currentScrollPx = getVerticalScrolledPixels(event);
      const { setCurrentPositionMs, setCurrentRowScrollPx } =
        useGanttStore.getState();

      setCurrentPositionMs(
        totalBounds.startMs + getHorizontalScrolledPixels(event) * msPerPx,
      );

      setCurrentRowScrollPx(currentScrollPx);
    },
    [msPerPx, totalBounds.startMs],
  );

  const assignContainerElementRef = useCallback(
    (element: HTMLDivElement | null) => {
      setContainerElement(element);
    },
    [],
  );

  const { start, end } = deriveRenderedSlice(
    roundedCurrentRowScrollPx,
    containerElement?.clientHeight ?? 0,
  );

  const renderedRows = useMemo(
    () =>
      Children.map(
        Children.toArray(children).slice(start, end) as RowChild[],
        applyVirtualizedRowStyles(start),
      ),
    [children, start, end],
  );

  return {
    dimensions: {
      height: Children.count(children) * GANTT_ROW_HEIGHT_PX,
      width: (totalBounds.endMs - totalBounds.startMs) / msPerPx,
    },
    renderedRows,
    assignContainerRef: assignContainerElementRef,
    onScroll: updateRoundedScrollPx,
  };
}

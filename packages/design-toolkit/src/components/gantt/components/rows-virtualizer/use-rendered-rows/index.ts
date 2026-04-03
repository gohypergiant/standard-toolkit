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

import {
  Children,
  cloneElement,
  type JSX,
  type PropsWithChildren,
  type ReactElement,
  useEffect,
  useMemo,
} from 'react';
import { useGanttContext } from '@/components/gantt/context';
import {
  useGanttStore,
  useGanttStoreApi,
} from '@/components/gantt/context/store';
import { useScrollbarHeight } from '@/components/gantt/hooks/use-scrollbar-height';
import { selectors } from '@/components/gantt/store';
import { deriveRenderedSlice } from '@/components/gantt/utils/layout';

type RowChild = ReactElement<JSX.IntrinsicElements['div']>;

const applyVirtualizedRowStyles =
  (startIndex: number, rowHeightPx: number) =>
  (element: RowChild, index: number) =>
    cloneElement(element, {
      style: {
        ...element.props.style,
        position: 'absolute',
        transform: `translateY(${rowHeightPx * (startIndex + index)}px)`,
        width: '100%',
      },
    });

type UseRenderedRowsValue = {
  height: number;
  renderedRows: ReactElement<JSX.IntrinsicElements['div']>[] | null;
};

type UseRenderedRowsProps = {
  heightPx: number;
};

export function useRenderedRows({
  children,
  heightPx,
}: PropsWithChildren<UseRenderedRowsProps>): UseRenderedRowsValue {
  const { rowHeightPx } = useGanttContext();
  const store = useGanttStoreApi();
  const roundedCurrentRowScrollPx = useGanttStore(
    selectors.roundedCurrentRowScrollPx,
  );
  const horizontalScrollbarHeight = useScrollbarHeight();

  const { start, end } = deriveRenderedSlice(
    roundedCurrentRowScrollPx,
    rowHeightPx,
    heightPx,
  );

  const renderedRows = useMemo(
    () =>
      Children.map(
        Children.toArray(children).slice(start, end) as RowChild[],
        applyVirtualizedRowStyles(start, rowHeightPx),
      ),
    [children, start, end, rowHeightPx],
  );

  const virtualizedHeight = useMemo(
    () => Children.count(children) * rowHeightPx + horizontalScrollbarHeight,
    [children, rowHeightPx, horizontalScrollbarHeight],
  );

  // Sets the total virtualized height in store so that it can be used
  // for Gantt overflow management.
  useEffect(() => {
    store.setState({ virtualizedHeightPx: virtualizedHeight });
  }, [virtualizedHeight, store]);

  return {
    height: virtualizedHeight,
    renderedRows,
  };
}

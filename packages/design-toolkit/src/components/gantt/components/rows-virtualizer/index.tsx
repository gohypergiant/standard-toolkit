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
  useState,
} from 'react';
import { GANTT_ROW_HEIGHT_PX } from '../../constants';
import { getVerticalScrolledPixels } from '../../utils/helpers';
import styles from './styles.module.css';

const BUFFERED_ROWS_COUNT = 1;

type RowChild = ReactElement<JSX.IntrinsicElements['div']>;

function deriveRenderedIndices(
  scrollPx: number,
  viewableRegionHeightPx: number,
) {
  const startIndex = Math.floor(scrollPx / GANTT_ROW_HEIGHT_PX);

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

export function RowsVirtualizer({ children }: PropsWithChildren) {
  const [roundedScrollPx, setRoundedScrollPx] = useState(0);
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);

  const updateRoundedScrollPx = (event: UIEvent<HTMLDivElement>) => {
    const currentScrollPx = getVerticalScrolledPixels(event);

    const roundedScrollPx =
      currentScrollPx - (currentScrollPx % GANTT_ROW_HEIGHT_PX);

    setRoundedScrollPx(roundedScrollPx);
  };

  const assignContainerElementRef = (element: HTMLDivElement | null) => {
    setContainerElement(element);
  };

  const { start, end } = deriveRenderedIndices(
    roundedScrollPx,
    containerElement?.clientHeight ?? 0,
  );

  const renderedRows = Children.map(
    Children.toArray(children).slice(start, end) as RowChild[],
    applyVirtualizedRowStyles(start),
  );

  return (
    <div
      ref={assignContainerElementRef}
      className={styles.container}
      onScroll={updateRoundedScrollPx}
    >
      <div
        className={styles['inner-container']}
        style={{ height: Children.count(children) * GANTT_ROW_HEIGHT_PX }}
      >
        {renderedRows}
      </div>
    </div>
  );
}

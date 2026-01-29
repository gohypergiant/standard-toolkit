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
import { GANTT_ROW_HEIGHT_PX } from '../../constants';
import { useGanttContext } from '../../context';
import { shouldRenderBlock } from '../../utils/helpers';
import styles from './styles.module.css';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { GanttRowBlockProps } from './gantt-row-block';

export function GanttRow({ children }: PropsWithChildren) {
  const { renderedRegionBoundary } = useGanttContext();
  const blocks = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<GanttRowBlockProps> => {
      return React.isValidElement(child);
    },
  );
  const renderedBlocks = blocks.filter((block) =>
    shouldRenderBlock(
      renderedRegionBoundary,
      block.props.startMs,
      block.props.endMs,
    ),
  );
  return (
    <div
      className={styles['row-container']}
      style={{ '--row-height': `${GANTT_ROW_HEIGHT_PX}px` } as CSSProperties}
    >
      {renderedBlocks}
    </div>
  );
}

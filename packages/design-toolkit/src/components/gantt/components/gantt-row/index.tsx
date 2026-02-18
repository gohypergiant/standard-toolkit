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
import { shouldRenderRangeElement } from '../../utils/helpers';
import styles from './styles.module.css';
import type { PropsWithChildren } from 'react';
import type { GanttRowElementProps } from './types';

export function GanttRow({ children, ...rest }: PropsWithChildren) {
  const { renderedRegionBounds } = useGanttContext();
  const elements = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<GanttRowElementProps> => {
      return React.isValidElement(child);
    },
  );
  const renderedElements = elements.filter((element) => {
    if (
      element.props.startMs !== undefined &&
      element.props.endMs !== undefined
    ) {
      return shouldRenderRangeElement(renderedRegionBounds, {
        startMs: element.props.startMs,
        endMs: element.props.endMs,
      });
    }

    return false;
  });

  return (
    <div
      className={styles['row-container']}
      data-height={GANTT_ROW_HEIGHT_PX}
      {...rest}
    >
      {renderedElements}
    </div>
  );
}

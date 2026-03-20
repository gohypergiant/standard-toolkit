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

import { type PropsWithChildren, useRef } from 'react';
import { GANTT_HEADER_HEIGHT_PX } from '@/components/gantt/constants';
import { useGanttStore } from '@/components/gantt/context/store';
import { useRootElementHeight } from '@/components/gantt/hooks/use-root-element-height';
import { selectors } from '@/components/gantt/store';
import styles from '../styles.module.css';

export function VirtualizedContentHeightContainer({
  children,
}: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  const virtualizedHeightPx = useGanttStore(selectors.virtualizedHeightPx);
  const rootElementHeight = useRootElementHeight();

  return (
    <div
      ref={ref}
      className={styles['virtualized-content-height']}
      data-height={virtualizedHeightPx + GANTT_HEADER_HEIGHT_PX}
    >
      <div className={styles.stuck} data-height={rootElementHeight}>
        {children}
      </div>
    </div>
  );
}

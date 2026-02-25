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

import { useCallback, useState } from 'react';
import { GANTT_BLOCK_HEIGHT_PX } from '../../constants';
import styles from './styles.module.css';
import { useRowElementLayout } from './use-row-element-layout';

export type GanttRowBlockProps = {
  id: string;
  startMs: number;
  endMs: number;
};

export function GanttRowBlock({ startMs, endMs }: GanttRowBlockProps) {
  const [blockElement, setBlockElement] = useState<HTMLDivElement | null>(null);

  useRowElementLayout({
    element: blockElement,
    timeBounds: {
      startMs,
      endMs,
    },
  });

  const assignBlockElementRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    setBlockElement(node);
  }, []);

  return (
    <div
      data-height={GANTT_BLOCK_HEIGHT_PX}
      ref={assignBlockElementRef}
      className={styles['row-block']}
    />
  );
}

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

import { useState } from 'react';
import { useGanttContext } from '../../context';
import { formatTimestampLabel } from '../../utils/formatting';
import styles from './styles.module.css';
import { useCurrentTimeTransform } from './use-current-time-transform';

function shouldRenderCurrentTime(
  currentTimeMs: number,
  renderedRegionBounds: {
    startMs: number;
    endMs: number;
  },
) {
  return (
    currentTimeMs >= renderedRegionBounds.startMs &&
    currentTimeMs <= renderedRegionBounds.endMs
  );
}

function useDisplayCurrentTime(currentTimeMs: number) {
  const { renderedRegionBounds } = useGanttContext();

  return shouldRenderCurrentTime(currentTimeMs, renderedRegionBounds);
}

function CurrentTimeInner({ currentTimeMs }: { currentTimeMs: number }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  useCurrentTimeTransform({
    currentTimeElement: element,
    currentTimeMs,
  });

  const assignElementRef = (node: HTMLDivElement) => {
    setElement(node);
  };

  return (
    <div ref={assignElementRef} className={styles['current-time-marker']}>
      <div className={styles['current-time-label']}>
        {formatTimestampLabel(currentTimeMs)}
      </div>
      <div className={styles['current-time-indicator']} />
    </div>
  );
}

export function CurrentTime({ currentTimeMs }: { currentTimeMs: number }) {
  const shouldDisplayCurrentTime = useDisplayCurrentTime(currentTimeMs);

  return shouldDisplayCurrentTime ? (
    <CurrentTimeInner currentTimeMs={currentTimeMs} />
  ) : null;
}

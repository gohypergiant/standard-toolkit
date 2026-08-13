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

import { useCallback, type UIEvent } from 'react';
import { useGanttStore } from '../../context/store';
import { useTemporalDataContext } from '../../context/temporal-data';
import { selectors } from '../../store';
import { getHorizontalScrolledPixels } from '../../utils/helpers';

type UseHorizontalScrollUpdateValue = {
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
};

export function useHorizontalScrollUpdate(): UseHorizontalScrollUpdateValue {
  const { totalBounds, msPerPx } = useTemporalDataContext();
  const setCurrentPositionMs = useGanttStore(selectors.setCurrentPositionMs);

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const scrolledPixels = getHorizontalScrolledPixels(event);

      setCurrentPositionMs(totalBounds.startMs + scrolledPixels * msPerPx);
    },
    [totalBounds.startMs, msPerPx, setCurrentPositionMs],
  );

  return { onScroll };
}

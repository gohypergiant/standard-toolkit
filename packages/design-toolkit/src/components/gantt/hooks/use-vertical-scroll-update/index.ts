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
import { useGanttContext } from '../../context';
import { useGanttStore } from '../../context/store';
import { selectors } from '../../store';
import { getVerticalScrolledPixels } from '../../utils/helpers';

type UseVerticalScrollUpdateValue = {
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
};

export function useVerticalScrollUpdate(): UseVerticalScrollUpdateValue {
  const { ganttContentElement, ganttPanelElement } = useGanttContext();
  const setCurrentRowScrollPx = useGanttStore(selectors.setCurrentRowScrollPx);

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const scrolledPixels = getVerticalScrolledPixels(event);

      setCurrentRowScrollPx(scrolledPixels);
      ganttPanelElement?.scrollTo({ top: scrolledPixels });
      ganttContentElement?.scrollTo({ top: scrolledPixels });
    },
    [setCurrentRowScrollPx, ganttPanelElement, ganttContentElement],
  );

  return { onScroll };
}

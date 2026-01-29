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

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { type GanttState, useGanttStore } from '../../store';

type UseLayoutSubscriptionProps<T> = {
  callback: (value: T) => void;
  selector: (state: GanttState) => T;
};

export function useLayoutSubscription<T>({
  callback,
  selector,
}: UseLayoutSubscriptionProps<T>) {
  useEffect(() => {
    let animationFrameId: number;

    const unsubscribe = useGanttStore.subscribe(
      selector,
      (value) => {
        animationFrameId = requestAnimationFrame(() => {
          // Invoke callback whenever the timestamp is changed.
          callback(value);
        });
      },
      {
        // Invoke immediately on initial subscription. If a subscribed value
        // change causes a re-render to occur, we want to perform layout
        // calculations using the latest value in the store after a browser
        // paint occurs (when this effect runs). Prevents potential layout
        // flickers because of calculations against a stale rendered UI
        // (since the subscription in this effect runs outside of the React
        // render cycle).
        fireImmediately: true,
        equalityFn: shallow,
      },
    );

    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubscribe();
    };
  }, [callback, selector]);
}

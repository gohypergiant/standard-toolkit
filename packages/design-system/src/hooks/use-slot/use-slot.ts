/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
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
  type RefCallback,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/**
 * Detects whether a slot has been utilized
 *
 * Example:
 * Parent component implements RAC Provider, with a slotted context
 * Child component implements slot prop matching provided slot in context
 * Parent is able to see that the slot has been fulfilled
 *
 * Copied from RAC: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L213
 * Due to not being exported, but quite handy
 */
export function useSlot(): [RefCallback<Element>, boolean] {
  // Assume we do have the slot in the initial render.
  const [hasSlot, setHasSlot] = useState(true);
  const hasRun = useRef(false);

  // A callback ref which will run when the slotted element mounts.
  // This should happen before the useLayoutEffect below.
  const ref = useCallback((el: HTMLElement | null) => {
    hasRun.current = true;
    setHasSlot(!!el);
  }, []);

  // If the callback hasn't been called, then reset to false.
  useLayoutEffect(() => {
    if (!hasRun.current) {
      setHasSlot(false);
    }
  }, []);

  return [ref, hasSlot];
}

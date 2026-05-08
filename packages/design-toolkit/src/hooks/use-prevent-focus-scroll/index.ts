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

import { useCallback, useRef } from 'react';
import type { Ref, RefCallback } from 'react';

/**
 * Returns a ref callback that forwards to the given external ref AND patches
 * the contained `<input>`'s `focus()` method to always pass
 * `{ preventScroll: true }`.
 *
 * Why: react-aria-components renders a visually-hidden a11y `<input>` inside
 * Switch / Checkbox / Radio, and on press its `usePress` handler calls
 * `inputRef.current.focus()` to forward keyboard focus. The browser's default
 * `focus()` runs `scrollIntoView({ block: 'nearest' })`, which causes any
 * scrollable ancestor to jump toward the 1×1 hidden input. Passing
 * `preventScroll: true` is the standard escape hatch and is what react-aria's
 * own `focusWithoutScrolling` utility uses elsewhere — useToggle / useRadio /
 * useRadioGroup just don't route through it.
 *
 * Track upstream: adobe/react-spectrum should change those press handlers to
 * use `focusWithoutScrolling`; once that ships, this hook can be removed.
 */
export function usePreventFocusScroll<T extends HTMLElement>(
  externalRef?: Ref<T> | null,
): RefCallback<T> {
  const externalRefHolder = useRef(externalRef);
  externalRefHolder.current = externalRef;

  const restoreRef = useRef<(() => void) | null>(null);

  return useCallback((node: T | null) => {
    restoreRef.current?.();
    restoreRef.current = null;

    const ext = externalRefHolder.current;
    if (typeof ext === 'function') {
      ext(node);
    } else if (ext && typeof ext === 'object') {
      (ext as React.RefObject<T | null>).current = node;
    }

    if (!node) {
      return;
    }

    const input = node.querySelector('input');
    if (!input) {
      return;
    }

    const hadOwnFocus = Object.hasOwn(input, 'focus');
    const original = input.focus;

    input.focus = function (options?: FocusOptions) {
      return original.call(this, { ...options, preventScroll: true });
    };

    restoreRef.current = () => {
      if (hadOwnFocus) {
        input.focus = original;
      } else {
        delete (input as { focus?: typeof original }).focus;
      }
    };
  }, []);
}

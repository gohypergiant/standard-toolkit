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
import type { Ref } from 'react';

/**
 * Custom hook that prevents scroll-into-view behavior when focus is triggered
 * on an element and its child inputs.
 *
 * This hook overrides the native focus() method on both the target element and
 * any input elements within it to always pass { preventScroll: true }, preventing
 * the browser from automatically scrolling the element into view when focused.
 *
 * @param ref - External ref to merge with internal ref
 * @returns A ref callback that overrides focus behavior with preventScroll
 *
 * @example
 * ```tsx
 * function MyComponent({ ref, ...props }) {
 *   const handleRef = usePreventScrollFocus(ref);
 *   return <label ref={handleRef}>...</label>;
 * }
 * ```
 */
export function usePreventScrollFocus<T extends HTMLElement = HTMLLabelElement>(
  ref: Ref<T> | null | undefined,
) {
  const internalRef = useRef<T>(null);

  const handleRef = useCallback(
    (node: T | null) => {
      internalRef.current = node;

      // Merge with external ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as any).current = node;
      }

      if (node) {
        // Override focus on the element (skip in test environments where focus is read-only)
        try {
          const originalFocus = node.focus;
          node.focus = function (options?: FocusOptions) {
            originalFocus.call(this, { ...options, preventScroll: true });
          };
        } catch {
          // In test environments (jsdom), focus is read-only and cannot be overridden
        }

        // Also override focus on any input elements inside
        const inputs = node.querySelectorAll('input');
        inputs.forEach((input) => {
          try {
            const originalInputFocus = input.focus;
            input.focus = function (options?: FocusOptions) {
              originalInputFocus.call(this, {
                ...options,
                preventScroll: true,
              });
            };
          } catch {
            // In test environments (jsdom), focus is read-only and cannot be overridden
          }
        });
      }
    },
    [ref],
  );

  return handleRef;
}

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

import { useEffect, useRef, useState } from 'react';

export interface UseEnterExitAnimationOptions {
  /**
   * Duration of the animation in milliseconds.
   * Should match the CSS animation duration.
   * @default 200
   */
  duration?: number;

  /**
   * Whether to skip animations on initial mount.
   * @default true
   */
  skipInitialMount?: boolean;
}

export interface UseEnterExitAnimationResult {
  /** True during the enter animation */
  isEntering: boolean;

  /** True during the exit animation */
  isExiting: boolean;
}

/**
 * Hook that manages enter and exit animation states based on an open/closed state.
 *
 * This hook provides `isEntering` and `isExiting` flags that can be used as
 * data attributes for CSS animations, similar to React Aria's built-in overlay
 * components (Tooltip, Popover, Dialog).
 *
 * @param isOpen - The current open/closed state
 * @param options - Configuration options
 * @returns Animation state flags
 *
 * @example
 * ```tsx
 * function MyComponent({ isOpen }) {
 *   const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
 *     duration: 200 // matches CSS var --animation-duration-normal
 *   });
 *
 *   return (
 *     <div
 *       data-open={isOpen || null}
 *       data-entering={isEntering || null}
 *       data-exiting={isExiting || null}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 * ```
 *
 * @example CSS
 * ```css
 * .component {
 *   opacity: 0;
 *   transform: translateX(-100%);
 *   transition: all var(--animation-duration-normal) var(--animation-easing-standard);
 *
 *   &[data-open] {
 *     opacity: 1;
 *     transform: translateX(0);
 *   }
 *
 *   &[data-entering] {
 *     animation: slideIn var(--animation-duration-normal) var(--animation-easing-decelerate);
 *   }
 *
 *   &[data-exiting] {
 *     animation: slideOut var(--animation-duration-normal) var(--animation-easing-accelerate);
 *   }
 * }
 * ```
 */
export function useEnterExitAnimation(
  isOpen: boolean,
  options: UseEnterExitAnimationOptions = {},
): UseEnterExitAnimationResult {
  const { duration = 200, skipInitialMount = true } = options;

  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  // Initialize prevIsOpen based on skipInitialMount to enable animation on mount when needed
  const prevIsOpen = useRef<boolean>(skipInitialMount ? isOpen : false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const wasInitialMount = isInitialMount.current;

    // Skip animation on initial mount if configured
    if (skipInitialMount && wasInitialMount) {
      isInitialMount.current = false;
      prevIsOpen.current = isOpen;
      return;
    }

    // Mark that we're past initial mount
    if (wasInitialMount) {
      isInitialMount.current = false;
    }

    const wasOpen = prevIsOpen.current;
    const currentlyOpen = isOpen;

    // Update ref for next render
    prevIsOpen.current = isOpen;

    // Opening transition (including initial mount with skipInitialMount: false)
    if (!wasOpen && currentlyOpen) {
      setIsEntering(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        setIsEntering(false);
      }, duration);

      return () => clearTimeout(timer);
    }

    // Closing transition
    if (wasOpen && !currentlyOpen) {
      setIsExiting(true);
      setIsEntering(false);

      const timer = setTimeout(() => {
        setIsExiting(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, skipInitialMount]);

  return {
    isEntering,
    isExiting,
  };
}

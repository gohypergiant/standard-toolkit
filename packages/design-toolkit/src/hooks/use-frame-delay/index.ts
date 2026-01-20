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

import { useEffect, useState } from 'react';

export interface UseFrameDelayOptions {
  /** Number of animation frames to wait (default: 2) */
  frames?: number;
  /** Callback fired when delay completes */
  onReady?: () => void;
}

export interface UseFrameDelayResult {
  /** Whether the delay has completed */
  isReady: boolean;
}

/**
 * Delays execution by a specified number of animation frames.
 *
 * Useful for deferring expensive renders to allow the browser to paint
 * a loading state first.
 *
 * @example
 * ```tsx
 * // Pattern 1: Reactive
 * function DeferredContent() {
 *   const { isReady } = useFrameDelay();
 *   if (!isReady) return <Fallback />;
 *   return <ExpensiveContent />;
 * }
 *
 * // Pattern 2: Callback
 * function WithCallback() {
 *   const [loaded, setLoaded] = useState(false);
 *   useFrameDelay({ onReady: () => setLoaded(true) });
 *   return loaded ? <Content /> : <Loading />;
 * }
 * ```
 */
export function useFrameDelay(
  options: UseFrameDelayOptions = {},
): UseFrameDelayResult {
  const { frames = 2, onReady } = options;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let animationId: number;

    const tick = () => {
      frameCount++;
      if (frameCount >= frames) {
        setIsReady(true);
        onReady?.();
      } else {
        animationId = requestAnimationFrame(tick);
      }
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [frames, onReady]);

  return { isReady };
}

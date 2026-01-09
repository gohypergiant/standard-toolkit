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

export interface UseDeferredCollectionOptions {
  /** Number of animation frames to defer before rendering (default: 2) */
  deferFrames?: number;
}

export interface UseDeferredCollectionResult {
  /** Whether the collection is ready to render */
  isReady: boolean;
}

/**
 * Defers rendering of large collections to prevent UI freezes.
 *
 * React Aria's collection system processes ALL items synchronously before
 * virtualization begins. This hook defers the collection render by a few
 * animation frames, allowing a skeleton placeholder to display first.
 *
 * @example
 * ```tsx
 * function VirtualizedList({ items }) {
 *   const { isReady } = useDeferredCollection();
 *
 *   if (!isReady) {
 *     return <SkeletonList count={10} />;
 *   }
 *
 *   return (
 *     <Virtualizer>
 *       <ListBox items={items}>
 *         {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
 *       </ListBox>
 *     </Virtualizer>
 *   );
 * }
 * ```
 */
export function useDeferredCollection(
  options: UseDeferredCollectionOptions = {},
): UseDeferredCollectionResult {
  const { deferFrames = 2 } = options;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let animationId: number;

    const tick = () => {
      frameCount++;
      if (frameCount >= deferFrames) {
        setIsReady(true);
      } else {
        animationId = requestAnimationFrame(tick);
      }
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [deferFrames]);

  return { isReady };
}

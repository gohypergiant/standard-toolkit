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

import { clsx } from '@accelint/design-foundation/lib/utils';
import { useDeferredCollection } from '../../hooks/use-deferred-collection';
import { Skeleton } from '../skeleton';
import type { DeferredCollectionProps } from './types';

/**
 * DeferredCollection - Defers rendering of large collections to prevent UI freezes.
 *
 * React Aria's collection system processes ALL items synchronously before
 * virtualization begins. This component defers the collection render by a few
 * animation frames, allowing a skeleton placeholder to display first.
 *
 * @example
 * // With skeleton config (simplest usage)
 * <DeferredCollection skeleton={{ count: 10, height: 32 }}>
 *   <Virtualizer>
 *     <ListBox items={items}>
 *       {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
 *     </ListBox>
 *   </Virtualizer>
 * </DeferredCollection>
 *
 * @example
 * // With custom fallback
 * <DeferredCollection fallback={<CustomLoadingState />}>
 *   <VirtualizedContent />
 * </DeferredCollection>
 */
export function DeferredCollection({
  children,
  skeleton,
  fallback,
  deferFrames = 2,
}: DeferredCollectionProps) {
  const { isReady } = useDeferredCollection({ deferFrames });

  if (isReady) {
    return <>{typeof children === 'function' ? children() : children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!skeleton) {
    return null;
  }

  const { count, height, className, gap = 4 } = skeleton;

  return (
    <div className={clsx('flex flex-col', className)} style={{ gap }}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders never reorder
        <Skeleton key={i} style={{ height }} />
      ))}
    </div>
  );
}

export type { DeferredCollectionProps, SkeletonConfig } from './types';

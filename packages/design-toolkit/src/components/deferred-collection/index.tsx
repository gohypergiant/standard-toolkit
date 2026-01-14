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

import { useFrameDelay } from '../../hooks/use-frame-delay';
import type { DeferredCollectionProps } from './types';

/**
 * DeferredCollection - Defers rendering of large collections to prevent UI freezes.
 *
 * React Aria's collection system processes ALL items synchronously before
 * virtualization begins. This component defers the collection render by a few
 * animation frames, allowing a fallback to display first.
 *
 * @example
 * <DeferredCollection fallback={<LoadingState />}>
 *   {() => (
 *     <Virtualizer>
 *       <ListBox items={items}>
 *         {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
 *       </ListBox>
 *     </Virtualizer>
 *   )}
 * </DeferredCollection>
 */
export function DeferredCollection({
  children,
  fallback,
  deferFrames,
}: DeferredCollectionProps) {
  const { isReady } = useFrameDelay({ frames: deferFrames });

  if (isReady) {
    return <>{typeof children === 'function' ? children() : children}</>;
  }

  return <>{fallback}</>;
}

export type { DeferredCollectionProps } from './types';

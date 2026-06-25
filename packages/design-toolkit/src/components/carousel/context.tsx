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

'use client';

import 'client-only';
import { createContext, useMemo } from 'react';
import type { ProviderProps } from '@/lib/types';
import type { CarouselProps } from './types';

/** React context providing carousel state to sub-components. */
export const CarouselContext = createContext<CarouselProps>({
  currentPosition: 0,
  items: [],
  setCurrentPosition: () => undefined,
});

/**
 * Provides carousel state to child components via CarouselContext.
 *
 * @param props - The provider props.
 * @param props.children - Child components that consume carousel context.
 * @param props.items - The carousel data items.
 * @param props.currentPosition - Zero-based index of the active item.
 * @param props.setCurrentPosition - Callback to update the active item.
 * @returns The context provider wrapping children.
 */
export function CarouselProvider({
  children,
  items,
  currentPosition,
  setCurrentPosition,
}: ProviderProps<CarouselProps>) {
  const value = useMemo(
    () => ({ currentPosition, items, setCurrentPosition }),
    [currentPosition, items, setCurrentPosition],
  );

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
}

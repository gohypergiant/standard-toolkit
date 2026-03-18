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
import { createContext, useState } from 'react';
import type { ProviderProps } from '@/lib/types';
import type { CarouselProps } from './types';

export const CarouselContext = createContext<
  CarouselProps & {
    setCurrentPosition: (position: number) => void;
    currentPosition: number;
  }
>({
  currentPosition: 0,
  items: [],
  variant: 'gallery',
  setCurrentPosition: () => {
    return null;
  },
});

export function CarouselProvider({
  children,
  items,
  variant,
}: ProviderProps<CarouselProps>) {
  const [currentPosition, setCurrentPosition] = useState(0);

  return (
    <CarouselContext.Provider
      value={{
        currentPosition,
        items,
        variant,
        setCurrentPosition,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

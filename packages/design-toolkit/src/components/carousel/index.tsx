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
import { clsx } from '@accelint/design-foundation/lib/utils';
import { CarouselProvider } from './context';
import styles from './style.module.css';
import type { CarouselData, CarouselProps } from './types';

const EMPTY_ITEMS: CarouselData[] = [];

/**
 * A compound carousel component for navigating a collection of media items.
 *
 * Provides carousel state via context to composable sub-components
 * (CarouselViewer, CarouselGallery, CarouselPrevious, CarouselNext,
 * CarouselPosition, CarouselSelect).
 *
 * @param props - The carousel props.
 * @param props.items - The carousel data items to display.
 * @param props.className - Custom class names for carousel elements.
 * @param props.children - Carousel sub-components to render.
 * @param props.currentPosition - Zero-based index of the active item.
 * @param props.setCurrentPosition - Callback invoked when the active item changes.
 * @returns The carousel component.
 *
 * @example
 * ```tsx
 * const [position, setPosition] = useState(0);
 *
 * <Carousel items={items} currentPosition={position} setCurrentPosition={setPosition}>
 *   <CarouselViewer />
 *   <CarouselPrevious />
 *   <CarouselGallery />
 *   <CarouselNext />
 * </Carousel>
 * ```
 */
export function Carousel({
  items = EMPTY_ITEMS,
  className,
  children,
  currentPosition,
  setCurrentPosition,
  ...rest
}: CarouselProps) {
  return (
    <CarouselProvider
      items={items}
      currentPosition={currentPosition}
      setCurrentPosition={setCurrentPosition}
    >
      <div {...rest} className={clsx(styles.carousel, className)}>
        {children}
      </div>
    </CarouselProvider>
  );
}

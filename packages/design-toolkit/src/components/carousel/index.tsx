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
import type { CarouselProps } from './types';

/**
 *
 * @param {Object} props - The component props.
 * @param {string} [props.variant='gallery'] - The variant of the carousel.
 * @param {Array} [props.items=[]] - The items to display in the carousel.
 * @param {Object} [props.classNames] - The class names to apply to the carousel.
 * @return {JSX.Element} The carousel component.
 */
export function Carousel({
  items = [],
  classNames,
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
      <div className={clsx(styles.carousel, classNames?.container)} {...rest}>
        {children}
      </div>
    </CarouselProvider>
  );
}

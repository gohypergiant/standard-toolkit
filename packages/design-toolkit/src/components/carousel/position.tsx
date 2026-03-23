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
import { useContext } from 'react';
import { CarouselContext } from './context';
import styles from './style.module.css';
import type { CarouselControlProps } from './types';

/**
 * Renders the position of the current item in a carousel.
 *
 * @return {JSX.Element} The JSX element representing the carousel position.
 * @property {string} className - The class name for carousel position display.
 */
export function CarouselPosition({ className, ...rest }: CarouselControlProps) {
  const context = useContext(CarouselContext);
  const { currentPosition, items } = context;
  return (
    <div className={clsx(styles.position, className)} {...rest}>
      {currentPosition + 1} / {items.length}
    </div>
  );
}

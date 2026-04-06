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
import { type HTMLAttributes, useContext } from 'react';
import { CarouselContext } from './context';
import styles from './style.module.css';

/**
 * Displays the current position and total item count (e.g. "3 / 9").
 * Note that it relies on the <Carousel/> component to supply context and must be used
 * as a child of that component.
 *
 * @param props - The position display props.
 * @param props.className - Additional CSS class name.
 * @returns The carousel position indicator.
 */
export function CarouselPosition({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const context = useContext(CarouselContext);
  const { currentPosition, items } = context;
  return (
    <div className={clsx(styles.position, className)} {...rest}>
      {currentPosition + 1} / {items.length}
    </div>
  );
}

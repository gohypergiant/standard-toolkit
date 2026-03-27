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
import type { CarouselViewerProps } from './types';

/**
 * Displays the full-size media for the currently active carousel item.
 *
 * Reads the active item from CarouselContext and renders it as an image.
 * Supports additional children for overlay content.
 *
 * @param props - The viewer props.
 * @param props.children - Optional overlay content rendered inside the viewer.
 * @param props.classNames - Custom class names for viewer elements.
 * @param props.classNames.container - Class name for the viewer container.
 * @param props.classNames.image - Class name for the displayed image.
 * @returns The carousel viewer component.
 *
 * @example
 * ```tsx
 * <CarouselViewer />
 * ```
 */
export function CarouselViewer({
  children,
  classNames,
  ...rest
}: CarouselViewerProps) {
  const { items, currentPosition } = useContext(CarouselContext);
  const currentItem = items[currentPosition];

  return (
    <div className={clsx(styles.viewer, classNames?.container)} {...rest}>
      <img
        src={currentItem?.dataUrl}
        alt={currentItem?.title}
        className={classNames?.image}
      />
      {children}
    </div>
  );
}

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
import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '../button';
import { CarouselContext } from './context';
import styles from './style.module.css';
import type { CarouselGalleryProps } from './types';

/**
 * Number of visible thumbnail items to keep before the selected item
 * when scrolling the gallery. This keeps the selected item visually
 * centered rather than pinned to the leading edge.
 */
const VISIBLE_ITEMS_BEFORE_SELECTED = 2;

/**
 * Renders a horizontally-scrolling strip of thumbnail buttons for carousel navigation.
 *
 * Automatically scrolls to keep the selected thumbnail visible. Clicking a
 * thumbnail navigates the carousel to that item.
 *
 * @param props - The gallery props.
 * @param props.classNames - Custom class names for gallery elements.
 * @param props.classNames.container - Class name for the gallery container.
 * @param props.classNames.item - Class name for individual gallery items.
 * @returns The carousel gallery component.
 *
 * @example
 * ```tsx
 * <CarouselGallery />
 * ```
 */
export function CarouselGallery({ classNames, ...rest }: CarouselGalleryProps) {
  const { items, currentPosition, setCurrentPosition } =
    useContext(CarouselContext);
  const [galleryXOffset, setGalleryXOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current?.children?.[0]?.getBoundingClientRect();
    const { width } = rect || { width: 0 };

    if (currentPosition > VISIBLE_ITEMS_BEFORE_SELECTED) {
      setGalleryXOffset(
        currentPosition * -width + width * VISIBLE_ITEMS_BEFORE_SELECTED,
      );
    } else {
      setGalleryXOffset(0);
    }
  }, [currentPosition]);

  return (
    <div
      className={clsx(
        styles['thumbnail-gallery-container'],
        classNames?.container,
      )}
      ref={containerRef}
      {...rest}
    >
      {items.map((item, index) => (
        <Button
          style={{
            translate: `${galleryXOffset}px`,
          }}
          className={clsx(
            styles['thumbnail-gallery-item'],
            currentPosition === index && styles.selected,
          )}
          onClick={() => setCurrentPosition(index)}
          key={`thumbnail-${item.uuid}`}
          size='small'
          data-id={`thumbnail-id-${item.uuid}`}
        >
          <img src={item.thumbnailUrl} alt={item.title} />
        </Button>
      ))}
    </div>
  );
}

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
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { CarouselContext } from './context';
import styles from './style.module.css';
import type { CarouselGalleryProps } from './types';
import { ToggleButton } from '../button/toggle';

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
 * thumbnail navigates the carousel to that item. Note that it relies on the <Carousel/>
 * component to supply context and must be used as a child of that component.
 *
 * @param props - The gallery props.
 * @param props.classNames - Custom class names for gallery elements.
 * @param props.classNames.container - Class name for the gallery container.
 * @param props.classNames.item - Class name for individual gallery items.
 * @returns The carousel gallery component.
 * ```
 */
export function CarouselGallery({ classNames, ...rest }: CarouselGalleryProps) {
  const { items, currentPosition, setCurrentPosition } =
    useContext(CarouselContext);
  const [galleryXOffset, setGalleryXOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = items[currentPosition];

  const handleItemClick = useCallback(
    (index: number) => {
      setCurrentPosition(index);
    },
    [setCurrentPosition],
  );

  // Calculate scroll position synchronously before browser paint to prevent visual flicker when the gallery scrolls
  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.children?.[0]?.getBoundingClientRect();
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
      {...rest}
      className={clsx(styles['gallery-container'], classNames?.container)}
      ref={containerRef}
    >
      {items.map((item, index) => {
        const isSelected = selectedItem && item.id === selectedItem.id;
        return (
          <ToggleButton
            style={{
              translate: `${galleryXOffset}px`,
            }}
            isSelected={isSelected}
            className={clsx(styles['gallery-item'], classNames?.item)}
            onClick={() => handleItemClick(index)}
            key={`thumbnail-${item.id}`}
            size='small'
            color='accent'
            data-id={`thumbnail-id-${item.id}`}
          >
            <img src={item.thumbnailUrl} alt={item.title} />
          </ToggleButton>
        );
      })}
    </div>
  );
}

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

export function CarouselGallery({ classNames, ...rest }: CarouselGalleryProps) {
  const context = useContext(CarouselContext);
  const { items, currentPosition, setCurrentPosition } = context;
  const [galleryXOffset, setGalleryXOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current?.children?.[0]?.getBoundingClientRect();
    const { width } = rect || { width: 0 };

    if (
      currentPosition > 2 &&
      galleryXOffset !== currentPosition * -width + width * 2
    ) {
      setGalleryXOffset(currentPosition * -width + width * 2);
    } else if (currentPosition <= 2) {
      setGalleryXOffset(0);
    }
  }, [currentPosition, galleryXOffset]);

  if (!items) {
    return null;
  }

  const updatePosition = (index: number) => {
    if (currentPosition === index) {
      return;
    }
    setCurrentPosition(index);
  };

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
          className={clsx(styles.selected, styles['thumbnail-gallery-item'])}
          style={{
            translate: `${galleryXOffset}px`,
            transition: 'all .3s ease',
            outline:
              currentPosition === index
                ? '2px solid var(--fg-accent-primary-bold)'
                : 'none',
          }}
          onClick={() => updatePosition(index)}
          key={`thumbnail-${item.uuid}`}
          data-id={`thumbnail-id-${item.uuid}`}
        >
          <img src={item.thumbnailUrl} alt={item.title} />
        </Button>
      ))}
    </div>
  );
}

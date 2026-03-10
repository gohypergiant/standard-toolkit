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
import { ChevronLeft, ChevronRight } from '@accelint/icons';
import { type PropsWithChildren, useContext, useMemo } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { OptionsItem } from '../options/item';
import { SelectField } from '../select-field';
import { CarouselContext, CarouselProvider } from './context';
import styles from './style.module.css';
import type {
  CarouselData,
  CarouselProps,
  CarouselThumbnailGalleryProps,
} from './types';

export function Carousel({
  children,
  variant = 'gallery',
  items = [],
}: CarouselProps) {
  return (
    <CarouselProvider variant={variant} currentPosition={0} items={items}>
      <div className={styles.carousel}>{children}</div>
    </CarouselProvider>
  );
}

/**
 * Main question here, how exactly are we wanting to display the image, and
 * how do we accommodate for NextJS and standard React workflows. Should we
 * be focused on one over the other? Research a bit more, see if we can find
 * some examples of how to tackle this, and the rest will likely be ezpz.
 */
export function CarouselViewer({ children }: PropsWithChildren) {
  const context = useContext(CarouselContext);
  const { currentPosition, items } = context;
  const currentItem = useMemo(
    () => items[currentPosition || 0],
    [currentPosition, items],
  );

  return (
    <div className={styles.viewer}>
      <img src={currentItem?.dataUrl} alt={currentItem?.title} />
    </div>
  );
}

export function CarouselControls({
  children,
  onPrevious,
  onNext,
}: PropsWithChildren & {
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.controls}>
      <CarouselNavigation direction='left' onClick={onPrevious} />
      {children}
      <CarouselNavigation direction='right' onClick={onNext} />
    </div>
  );
}

export function CarouselNavigation({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} className={styles.navigation} variant='flat'>
      <Icon>{direction === 'left' ? <ChevronLeft /> : <ChevronRight />}</Icon>
    </Button>
  );
}

export function CarouselThumbnailGallery({
  onSelect,
}: CarouselThumbnailGalleryProps) {
  const context = useContext(CarouselContext);
  const { items } = context;

  return (
    <>
      {items.map((item, _index) => (
        // TODO: Should this be a button?
        <div className={styles['thumbnail-gallery']} key={item.uuid}>
          <img src={item.thumbnailUrl} alt={item.title} />
        </div>
      ))}
    </>
  );
}

// Depends on how we want to handle carousel state. Might just grab
// this from context if image array is passed in there.
export function CarouselPositionDisplay({
  currentPosition,
  itemCount,
}: {
  currentPosition: number;
  itemCount: number;
}) {
  return (
    <div>
      {currentPosition} / {itemCount}
    </div>
  );
}

export function CarouselSelectField({ items }: { items: CarouselData[] }) {
  return (
    <SelectField placeholder='img'>
      {items.map((item) => (
        <OptionsItem textValue={item.title} key={item.uuid}>
          {item.title}
        </OptionsItem>
      ))}
    </SelectField>
  );
}

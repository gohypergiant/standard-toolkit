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
import { useContext, useEffect, useState } from 'react';
import { clsx } from 'react-querybuilder';
import { Button } from '../button';
import { Icon } from '../icon';
import { OptionsItem } from '../options/item';
import { SelectField } from '../select-field';
import { CarouselContext, CarouselProvider } from './context';
import styles from './style.module.css';
import type { Key } from 'react-aria-components';
import type {
  CarouselNavigationProps,
  CarouselProps,
  CarouselViewerProps,
} from './types';

export function Carousel({
  variant = 'gallery',
  items = [],
  classNames,
}: CarouselProps) {
  return (
    <CarouselProvider variant={variant} items={items}>
      <div className={clsx(styles.carousel, classNames?.container)}>
        <CarouselViewer />
        <div className={styles.controls}>
          {variant === 'gallery' && (
            <>
              <CarouselPrevious />
              <CarouselThumbnailGallery />
              <CarouselNext />
            </>
          )}
          {variant === 'select' && (
            <>
              <CarouselPositionDisplay />
              <CarouselSelectField />
            </>
          )}
        </div>
      </div>
    </CarouselProvider>
  );
}

export function CarouselViewer({
  children,
  classNames,
  ...rest
}: CarouselViewerProps) {
  const context = useContext(CarouselContext);
  const { items, currentPosition } = context;
  const [currentItem, setCurrentItem] = useState(items[currentPosition]);

  useEffect(() => {
    if (items[currentPosition]?.uuid !== currentItem?.uuid) {
      setCurrentItem(items[currentPosition]);
    }
  }, [currentPosition, items, currentItem]);

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

export function CarouselNavigation({
  direction,
  onClick,
  isDisabled,
}: CarouselNavigationProps) {
  return (
    <Button
      onClick={onClick}
      className={styles.navigation}
      variant='flat'
      isDisabled={isDisabled}
    >
      <Icon>{direction === 'left' ? <ChevronLeft /> : <ChevronRight />}</Icon>
    </Button>
  );
}

export function CarouselPrevious() {
  const context = useContext(CarouselContext);
  const { currentPosition, setCurrentPosition } = context;

  const onClick = () => {
    if (currentPosition - 1 >= 0) {
      setCurrentPosition(currentPosition - 1);
    }
  };

  return (
    <CarouselNavigation
      direction='left'
      onClick={onClick}
      isDisabled={currentPosition === 0}
    />
  );
}

export function CarouselNext() {
  const context = useContext(CarouselContext);
  const { currentPosition, setCurrentPosition, items } = context;

  const onClick = () => {
    if (currentPosition + 1 < items.length) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  return (
    <CarouselNavigation
      direction='right'
      onClick={onClick}
      isDisabled={currentPosition === items.length - 1}
    />
  );
}

export function CarouselThumbnailGallery({
  classNames,
}: {
  classNames?: {
    container?: string;
  };
}) {
  const context = useContext(CarouselContext);
  const { items, currentPosition, setCurrentPosition } = context;
  const [galleryXOffset, setGalleryXOffset] = useState(0);

  useEffect(() => {
    // Current Position * -(Item Width + Margin) + (Item Width + Margin) * 3 = 204
    // TODO: get these numbers dynamically??
    if (currentPosition > 3 && galleryXOffset !== currentPosition * -68 + 204) {
      setGalleryXOffset(currentPosition * -68 + 204);
    } else if (currentPosition <= 3) {
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
    >
      {items.map((item, index) => (
        <Button
          className={clsx(
            styles['thumbnail-gallery-item'],
            currentPosition === index && styles.selected,
          )}
          style={{
            translate: `${galleryXOffset}px`,
            transition: 'all .3s ease',
          }}
          key={item.uuid}
          onClick={() => updatePosition(index)}
        >
          <img src={item.thumbnailUrl} alt={item.title} />
        </Button>
      ))}
    </div>
  );
}

export function CarouselSelectField() {
  const context = useContext(CarouselContext);
  const { items, currentPosition, setCurrentPosition } = context;

  const onChange = (value: Key | null) => {
    const index = items.findIndex((i) => i.uuid === value);
    if (index >= 0) {
      setCurrentPosition(index);
    }
  };

  return (
    <SelectField
      aria-labelledby='select-field'
      value={items[currentPosition]?.title}
      placeholder={items[currentPosition]?.title}
      onChange={onChange}
      classNames={{
        field: styles['select-field'],
        trigger: styles['select-trigger'],
      }}
    >
      {items.map((item) => (
        <OptionsItem
          textValue={item.title}
          key={item.uuid}
          aria-label={item.title}
          id={item.uuid}
        >
          {item.title}
        </OptionsItem>
      ))}
    </SelectField>
  );
}

export function CarouselPositionDisplay() {
  const context = useContext(CarouselContext);
  const { currentPosition, items } = context;
  return (
    <div className={styles.position}>
      <CarouselPrevious />
      {currentPosition + 1} / {items.length}
      <CarouselNext />
    </div>
  );
}

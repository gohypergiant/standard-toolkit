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
import { type PropsWithChildren, useContext } from 'react';
import { clsx } from 'react-querybuilder';
import { Button } from '../button';
import { Icon } from '../icon';
import { OptionsItem } from '../options/item';
import { SelectField } from '../select-field';
import { CarouselContext, CarouselProvider } from './context';
import styles from './style.module.css';
import type {
  CarouselData,
  CarouselNavigationProps,
  CarouselProps,
} from './types';

export function Carousel({
  children,
  variant = 'gallery',
  items = [],
  setCurrentPosition,
}: CarouselProps) {
  return (
    <CarouselProvider
      variant={variant}
      currentPosition={0}
      items={items}
      setCurrentPosition={setCurrentPosition}
    >
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
export function CarouselViewer({
  currentItem,
}: {
  currentItem: CarouselData | undefined;
}) {
  return (
    <div className={styles.viewer}>
      <img src={currentItem?.dataUrl} alt={currentItem?.title} />
      {currentItem?.title}
    </div>
  );
}

export function CarouselControls({ children }: PropsWithChildren) {
  const context = useContext(CarouselContext);
  const { currentPosition, items, setCurrentPosition } = context;

  if (!items) {
    return null;
  }

  const onPrevious = () => {
    setCurrentPosition(currentPosition - 1 < 0 ? 0 : currentPosition - 1);
  };
  const onNext = () =>
    setCurrentPosition(
      currentPosition + 1 > items.length + 1 ? 0 : currentPosition + 1,
    );

  return (
    <div className={styles.controls}>
      <CarouselNavigation
        direction='left'
        onClick={onPrevious}
        isDisabled={currentPosition === 0}
      />
      {children}
      <CarouselNavigation
        direction='right'
        onClick={onNext}
        isDisabled={currentPosition === items.length - 1}
      />
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

export function CarouselThumbnailGallery() {
  const context = useContext(CarouselContext);
  const { items, currentPosition, setCurrentPosition } = context;
  const selectedStyle = 'outline-accent-primary-bold outline-2';

  if (!items) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => (
        // TODO: Should this be a button?
        <Button
          className={clsx(
            styles['thumbnail-gallery'],
            currentPosition === index && selectedStyle,
          )}
          key={item.uuid}
          onClick={() => {
            if (currentPosition === index) {
              return;
            }
            setCurrentPosition(index);
          }}
        >
          <img src={item.thumbnailUrl} alt={item.title} />
        </Button>
      ))}
    </>
  );
}

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

export function CarouselSelectField() {
  const context = useContext(CarouselContext);
  const { items, setCurrentPosition } = context;

  return (
    <SelectField
      placeholder='img'
      onChange={(_value: any, index: number) => setCurrentPosition(index)}
    >
      _value
      {items.map((item) => (
        <OptionsItem textValue={item.title} key={item.uuid}>
          {item.title}
        </OptionsItem>
      ))}
    </SelectField>
  );
}

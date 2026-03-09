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
import { Button } from '../button';
import { Icon } from '../icon';
import { CarouselProvider } from './context';
import type { PropsWithChildren } from 'react';
import type { CarouselProps } from './types';

export function Carousel({ children, variant = 'gallery' }: CarouselProps) {
  return (
    <CarouselProvider variant={variant} currentPosition={0}>
      {children}
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
  return <div>{children}</div>;
}

export function CarouselControls({ children }: PropsWithChildren) {
  // TODO: Make pre-built component here? Or allow for the manual placement of
  // navigation controls?
  return <div>{children}</div>;
}

export function CarouselNavigation({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick}>
      <Icon>{direction === 'left' ? <ChevronLeft /> : <ChevronRight />}</Icon>
    </Button>
  );
}

export function CarouselThumbnailGallery() {
  // height 284, y spacing-s, w-full

  return <div>thumbnails</div>;
}

export function CarouselThumbnailItem() {
  return <div>item</div>;
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

export function CarouselSelectField({ items }: { items: any[] }) {
  return <div>hej</div>;
  // return {
  //   <SelectField>
  //     {items.map((item) => (
  //       <Selectio
  //     ))}
  //   </SelectField>
  // }
}

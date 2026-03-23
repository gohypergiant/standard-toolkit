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

// TODO: Redo entire file.
import { uuid } from '@accelint/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Carousel } from '.';
import { CarouselGallery } from './gallery';
import { CarouselNext, CarouselPrevious } from './navigation';
import { CarouselPosition } from './position';
import { CarouselSelect } from './select';
import { CarouselViewer } from './viewer';
import type { CarouselData, CarouselProps } from './types';

const TEST_ITEMS = [
  {
    dataType: 'image',
    dataUrl: 'https://example.com/image1.jpg',
    fileName: 'image1.jpg',
    title: 'Image 1',
    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://example.com/image2.jpg',
    fileName: 'image2.jpg',
    title: 'Image 2',
    thumbnailUrl: 'https://example.com/thumbnail2.jpg',
    uuid: uuid(),
  },
] as CarouselData[];

function setup({
  children = (
    <>
      <CarouselViewer data-testid='viewer' />
      <CarouselPrevious data-testid='previous' />
      <CarouselGallery data-testid='gallery' />
      <CarouselNext data-testid='next' />
      <CarouselPosition data-testid='position' />
      <CarouselSelect data-testid='select' />
    </>
  ),
  ...rest
}: Partial<CarouselProps> = {}) {
  const result = render(<Carousel items={TEST_ITEMS}>{children}</Carousel>);
  return {
    ...result,
    ...rest,
    children,
  };
}

describe('Carousel', () => {
  const defaultProps: CarouselProps = {
    items: TEST_ITEMS,
  };

  it('renders the carousel with the correct number of items', () => {
    setup();
    const gallery = screen.getByTestId('gallery');
    expect(gallery.childNodes.length).toBe(defaultProps.items.length);
  });

  it('renders the correct item as the current item', () => {
    setup();
    const viewer = screen.getByTestId('viewer');
    const image = viewer.firstElementChild;
    expect(image?.getAttribute('src')).toBe(TEST_ITEMS[0]?.dataUrl);
    expect(viewer);
  });

  it('previous is disabled when currentPosition === 0, otherwise enabled', async () => {
    setup();
    const previousButton = screen.getByTestId('previous');
    expect(previousButton.getAttribute('data-disabled')).toBe('true');
    const nextButton = screen.getByTestId('next');
    // Current position += 1
    await userEvent.click(nextButton);
    // No attribute when enabled.
    expect(previousButton.getAttribute('data-disabled')).toBe(null);
  });

  it('next is disabled when currentPosition === items.length - 1, otherwise enabled', async () => {
    setup();
    const nextButton = screen.getByTestId('next');
    expect(nextButton.getAttribute('data-disabled')).toBe(null);
    await userEvent.click(nextButton);
    expect(nextButton.getAttribute('data-disabled')).toBe('true');
  });

  it('updates the current item when selected from gallery', async () => {
    setup();
    const gallery = screen.getByTestId('gallery');
    await userEvent.click(gallery.children[1] as Element);
    const viewer = screen.getByTestId('viewer');
    const image = viewer.firstElementChild;
    expect(image?.getAttribute('src')).toBe(TEST_ITEMS[1]?.dataUrl);
    expect(viewer);
  });

  it('displays correct current position and total item count', async () => {
    setup();
    const position = screen.getByTestId('position');
    console.log(position);
    expect(position).toHaveTextContent('1 / 2');
    const nextButton = screen.getByTestId('next');
    await userEvent.click(nextButton);
    expect(position).toHaveTextContent('2 / 2');
  });
});

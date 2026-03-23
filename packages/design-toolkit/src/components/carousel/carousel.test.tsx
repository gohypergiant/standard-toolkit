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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Carousel } from '.';
import { CAROUSEL_ITEMS } from './__fixtures__';
import { CarouselGallery } from './gallery';
import { CarouselNext, CarouselPrevious } from './navigation';
import { CarouselPosition } from './position';
import { CarouselSelect } from './select';
import { CarouselViewer } from './viewer';
import type { CarouselProps } from './types';

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
  currentPosition = 0,
  setCurrentPosition = vi.fn(),
  ...rest
}: Partial<CarouselProps> = {}) {
  const result = render(
    <Carousel
      items={CAROUSEL_ITEMS}
      currentPosition={currentPosition}
      setCurrentPosition={setCurrentPosition}
    >
      {children}
    </Carousel>,
  );
  return {
    ...result,
    ...rest,
    children,
  };
}

describe('Carousel', () => {
  it('renders the carousel with the correct number of items', () => {
    setup();
    const gallery = screen.getByTestId('gallery');
    expect(gallery.childNodes.length).toBe(CAROUSEL_ITEMS.length);
  });

  it('renders the correct item as the current item', () => {
    setup();
    const viewer = screen.getByTestId('viewer');
    const image = viewer.firstElementChild;
    expect(image?.getAttribute('src')).toBe(CAROUSEL_ITEMS[0]?.dataUrl);
    expect(viewer);
  });

  it('previous is disabled when currentPosition === 0, otherwise enabled', () => {
    setup();
    const previousButton = screen.getByTestId('previous');
    expect(previousButton.getAttribute('data-disabled')).toBe('true');
  });

  it('previous should be enabled when currentPosition > 0', async () => {
    const setCurrentPosition = vi.fn();
    setup({ currentPosition: 1, setCurrentPosition });
    const previousButton = screen.getByTestId('previous');
    expect(previousButton.getAttribute('data-disabled')).toBe(null);
    await userEvent.click(previousButton);
    expect(setCurrentPosition).toHaveBeenCalledWith(0);
  });

  it('next is enabled when currentPosition < items.length - 1', () => {
    setup();
    const nextButton = screen.getByTestId('next');
    expect(nextButton.getAttribute('data-disabled')).toBe(null);
  });

  it('next should be disabled when currentPosition === items.length - 1', () => {
    setup({ currentPosition: CAROUSEL_ITEMS.length - 1 });
    const nextButton = screen.getByTestId('next');
    expect(nextButton.getAttribute('data-disabled')).toBe('true');
  });

  it('updates the current item when selected from gallery', async () => {
    const setCurrentPosition = vi.fn();
    setup({ setCurrentPosition });
    const gallery = screen.getByTestId('gallery');
    await userEvent.click(gallery.children[1] as Element);
    expect(setCurrentPosition).toHaveBeenCalledWith(1);
  });

  it('displays correct current position and total item count', () => {
    setup({ currentPosition: 1 });
    const position = screen.getByTestId('position');
    // Current Position + 1 / total
    expect(position).toHaveTextContent(`2 / ${CAROUSEL_ITEMS.length}`);
  });
});

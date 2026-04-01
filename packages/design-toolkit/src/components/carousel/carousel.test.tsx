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
import { CAROUSEL_ITEMS, MIXED_CAROUSEL_ITEMS } from './__fixtures__';
import type { CarouselData } from './types';
import { CarouselGallery } from './gallery';
import { CarouselNext, CarouselPrevious } from './navigation';
import { CarouselPosition } from './position';
import { CarouselSelect } from './select';
import { CarouselViewer } from './viewer';

function setup({
  items = CAROUSEL_ITEMS,
  currentPosition = 0,
  setCurrentPosition = vi.fn<(index: number) => void>(),
}: {
  items?: CarouselData[];
  currentPosition?: number;
  setCurrentPosition?: ReturnType<typeof vi.fn<(index: number) => void>>;
} = {}) {
  const result = render(
    <Carousel
      items={items}
      currentPosition={currentPosition}
      setCurrentPosition={setCurrentPosition}
    >
      <CarouselViewer />
      <CarouselPrevious />
      <CarouselGallery />
      <CarouselNext />
      <CarouselPosition />
      <CarouselSelect />
    </Carousel>,
  );
  return { setCurrentPosition, container: result.container };
}

describe('Carousel', () => {
  it('should render all carousel items as thumbnails', () => {
    setup();
    const images = screen.getAllByRole('img');
    // Viewer image + one thumbnail per item
    expect(images).toHaveLength(CAROUSEL_ITEMS.length + 1);
  });

  it('should display the first item in the viewer', () => {
    setup();
    // Both viewer and gallery render images with same alt text
    // Verify full-size image (dataUrl) is displayed, not just thumbnail
    const images: HTMLImageElement[] = screen.getAllByRole('img', {
      name: CAROUSEL_ITEMS[0]?.title,
    });
    const hasViewerImage = images.some(
      (img) => img.src === CAROUSEL_ITEMS[0]?.dataUrl,
    );
    expect(hasViewerImage).toBe(true);
  });

  it('should disable the previous button at the start', () => {
    setup();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('should enable and navigate the previous button after the first item', async () => {
    const user = userEvent.setup();
    const setCurrentPosition = vi.fn<(index: number) => void>();
    setup({ currentPosition: 1, setCurrentPosition });

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeEnabled();
    await user.click(previousButton);
    expect(setCurrentPosition).toHaveBeenCalledWith(0);
  });

  it('should enable the next button before the last item', () => {
    setup();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  it('should disable the next button at the end', () => {
    setup({ currentPosition: CAROUSEL_ITEMS.length - 1 });
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('should navigate to a thumbnail when clicked', async () => {
    const user = userEvent.setup();
    const setCurrentPosition = vi.fn<(index: number) => void>();
    setup({ setCurrentPosition });

    await user.click(
      screen.getByRole('button', { name: CAROUSEL_ITEMS[1]?.title }),
    );
    expect(setCurrentPosition).toHaveBeenCalledWith(1);
  });

  it('should display the current position and total count', () => {
    setup({ currentPosition: 1 });
    expect(
      screen.getByText(`2 / ${CAROUSEL_ITEMS.length}`),
    ).toBeInTheDocument();
  });
});

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

import { useState } from 'react';
import {
  Carousel,
  CarouselControls,
  CarouselThumbnailGallery,
  CarouselViewer,
} from './';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CarouselData } from './types';

const meta = {
  args: {
    variant: 'gallery',
  },
  title: 'Components/Carousel',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const CAROUSEL_ITEMS: CarouselData[] = [];

export const Default: Story = {
  render: (args) => {
    const [_currentPosition, setCurrentPosition] = useState(0);
    // TODO: Should this be baked in via context?
    const onNext = () =>
      setCurrentPosition((prev) =>
        prev + 1 > CAROUSEL_ITEMS.length ? prev + 1 : prev,
      );
    const onPrevious = () =>
      setCurrentPosition((prev) => (prev - 1 < 0 ? prev - 1 : 0));

    return (
      <Carousel variant={args.variant}>
        {/* ? Design, can we condense the structure here. */}
        <CarouselViewer>View</CarouselViewer>
        <CarouselControls onNext={onNext} onPrevious={onPrevious}>
          <CarouselThumbnailGallery items={CAROUSEL_ITEMS} />
        </CarouselControls>
      </Carousel>
    );
  },
};

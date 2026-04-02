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
import { Carousel } from './';
import { CAROUSEL_ITEMS, MIXED_CAROUSEL_ITEMS } from './__fixtures__';
import { CarouselGallery } from './gallery';
import { CarouselNext, CarouselPrevious } from './navigation';
import { CarouselPosition } from './position';
import { CarouselSelect } from './select';
import { CarouselViewer } from './viewer';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Carousel',
  args: {
    items: CAROUSEL_ITEMS,
  },
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: (args) => {
    const [currentPosition, setCurrentPosition] = useState(0);

    return (
      <Carousel
        items={args.items}
        currentPosition={currentPosition}
        setCurrentPosition={setCurrentPosition}
        classNames={{ container: 'max-w-[600px]' }}
      >
        <CarouselViewer />
        <div className='flex w-full flex-row justify-between gap-s'>
          <CarouselPrevious />
          <CarouselGallery />
          <CarouselNext />
        </div>
      </Carousel>
    );
  },
};

export const WithSelect: Story = {
  render: (args) => {
    const [currentPosition, setCurrentPosition] = useState(0);

    return (
      <Carousel
        items={args.items}
        currentPosition={currentPosition}
        setCurrentPosition={setCurrentPosition}
        classNames={{ container: 'max-w-[600px]' }}
      >
        <CarouselViewer />
        <div className='flex flex-row justify-between gap-s p-s'>
          <div className='flex shrink-0 flex-row gap-s'>
            <CarouselPrevious />
            <CarouselPosition />
            <CarouselNext />
          </div>
          <CarouselSelect />
        </div>
      </Carousel>
    );
  },
};

export const MixedMedia: Story = {
  args: {
    items: MIXED_CAROUSEL_ITEMS,
  },
  render: (args) => {
    const [currentPosition, setCurrentPosition] = useState(0);

    return (
      <Carousel
        items={args.items}
        currentPosition={currentPosition}
        setCurrentPosition={setCurrentPosition}
        classNames={{ container: 'max-w-[600px]' }}
      >
        <CarouselViewer />
        <div className='flex w-full flex-row justify-between gap-s'>
          <CarouselPrevious />
          <CarouselGallery />
          <CarouselNext />
        </div>
      </Carousel>
    );
  },
};

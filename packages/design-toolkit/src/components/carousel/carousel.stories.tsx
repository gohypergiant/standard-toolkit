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

import { uuid } from '@accelint/core';
import { useState } from 'react';
import { Carousel } from './';
import { CarouselGallery } from './gallery';
import { CarouselNext, CarouselPrevious } from './navigation';
import { CarouselPosition } from './position';
import { CarouselSelect } from './select';
import { CarouselViewer } from './viewer';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CarouselData } from './types';

const CAROUSEL_ITEMS: CarouselData[] = [
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/244',
    fileName: 'placecage-1',
    title: 'Place Cage 1',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/32',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/240',
    fileName: 'placecage-2',
    title: 'Place Cage 2',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/33',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/248',
    fileName: 'placecage-3',
    title: 'Place Cage 3',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/34',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/234',
    fileName: 'placecage-4',
    title: 'Place Cage 4',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/32',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/241',
    fileName: 'placecage-5',
    title: 'Place Cage 5',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/33',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/249',
    fileName: 'placecage-6',
    title: 'Place Cage 6',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/34',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/242',
    fileName: 'placecage-7',
    title: 'Place Cage 7',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/32',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/243',
    fileName: 'placecage-8',
    title: 'Place Cage 8',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/33',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://placecage.lucidinternets.com/434/248',
    fileName: 'placecage-9',
    title: 'Place Cage 9',
    thumbnailUrl: 'https://placecage.lucidinternets.com/57/34',
    uuid: uuid(),
  },
];

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
        <div className='flex flex-row justify-between gap-s'>
          <CarouselPrevious />
          <CarouselPosition />
          <CarouselNext />
          <CarouselSelect />
        </div>
      </Carousel>
    );
  },
};

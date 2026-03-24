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
import type { CarouselData } from '../types';

export const CAROUSEL_ITEMS: CarouselData[] = [
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/1/434/244',
    fileName: 'placecage-1',
    title: 'Place Cage 1',
    thumbnailUrl: 'https://picsum.photos/seed/1/57/32',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/2/434/240',
    fileName: 'placecage-2',
    title: 'Place Cage 2',
    thumbnailUrl: 'https://picsum.photos/seed/2/57/33',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/3/434/248',
    fileName: 'placecage-3',
    title: 'Place Cage 3',
    thumbnailUrl: 'https://picsum.photos/seed/3/57/34',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/4/434/234',
    fileName: 'placecage-4',
    title: 'Place Cage 4',
    thumbnailUrl: 'https://picsum.photos/seed/4/57/32',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/5/434/241',
    fileName: 'placecage-5',
    title: 'Place Cage 5',
    thumbnailUrl: 'https://picsum.photos/seed/5/57/33',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/6/434/249',
    fileName: 'placecage-6',
    title: 'Place Cage 6',
    thumbnailUrl: 'https://picsum.photos/seed/6/57/34',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/7/434/242',
    fileName: 'placecage-7',
    title: 'Place Cage 7',
    thumbnailUrl: 'https://picsum.photos/seed/7/57/32',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/8/434/243',
    fileName: 'placecage-8',
    title: 'Place Cage 8',
    thumbnailUrl: 'https://picsum.photos/seed/8/57/33',
    uuid: uuid(),
  },
  {
    dataType: 'image',
    dataUrl: 'https://picsum.photos/seed/9/434/248',
    fileName: 'placecage-9',
    title: 'Place Cage 9',
    thumbnailUrl: 'https://picsum.photos/seed/9/57/34',
    uuid: uuid(),
  },
];

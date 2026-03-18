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

import type { UniqueId } from '@accelint/core';
import type { PropsWithChildren } from 'react';

export type CarouselProps = PropsWithChildren & {
  // image/video/audio data to populate the carousel component.
  items: CarouselData[];
  // thumbnails gallery, no thumbnails, or SelectField selection
  variant?: 'gallery' | 'noPreview' | 'select';
  // custom classNames for the component
  classNames?: {
    container?: string;
  };
};
export type CarouselData = {
  dataType: 'image' | 'video' | 'audio';
  dataUrl: string;
  fileName: string;
  metadata?: object;
  title: string;
  thumbnailUrl: string;
  uuid: UniqueId;
};

export type CarouselNavigationProps = {
  direction: 'left' | 'right';
  onClick?: () => void;
  isDisabled?: boolean;
};

export type CarouselThumbnailGalleryProps = {
  currentPosition: number;
  classNames?: {
    container?: string;
    item?: string;
  };
};

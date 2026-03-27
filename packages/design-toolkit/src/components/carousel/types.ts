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
import type { HTMLAttributes, PropsWithChildren } from 'react';
import type { OptionsDataItem, OptionsItemProps } from '../options/types';
import type { SelectFieldProps } from '../select-field/types';

/**
 * Props for the root Carousel component.
 */
export type CarouselProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
> & {
  /** The carousel data items to display. */
  items: CarouselData[];
  /** Custom class names for carousel elements. */
  classNames?: {
    /** Class name for the outer container. */
    container?: string;
  };
  /** Zero-based index of the currently active item. */
  currentPosition: number;
  /** Callback invoked when the active item changes. */
  setCurrentPosition: (index: number) => void;
};

/**
 * Data describing a single carousel item.
 */
export type CarouselData = {
  /** The media type of the item. */
  dataType: 'image' | 'video' | 'audio';
  /** URL for the full-size media displayed in the viewer. */
  dataUrl: string;
  /** Original file name of the media asset. */
  fileName: string;
  /** Optional metadata associated with the item. */
  metadata?: Record<string, unknown>;
  /** Display title shown in the gallery and select. */
  title: string;
  /** URL for the thumbnail image shown in the gallery. */
  thumbnailUrl: string;
  /** Unique identifier for the item. */
  uuid: UniqueId;
};

/**
 * Props for the CarouselViewer component.
 */
export type CarouselViewerProps = PropsWithChildren & {
  /** Custom class names for viewer elements. */
  classNames?: {
    /** Class name for the viewer container. */
    container?: string;
    /** Class name for the displayed image. */
    image?: string;
  };
};

/**
 * Props for the internal CarouselNavigation button component.
 */
export type CarouselNavigationProps = HTMLAttributes<HTMLButtonElement> & {
  /** Direction the button navigates. */
  direction: 'left' | 'right';
  /** Whether the navigation button is disabled. */
  isDisabled?: boolean;
};

/**
 * Shared props for carousel control sub-components (Previous, Next, Position).
 */
export type CarouselControlProps = {
  /** Additional CSS class name. */
  className?: string;
};

/**
 * Props for the CarouselSelect dropdown component.
 */
export type CarouselSelectProps = CarouselControlProps & {
  /** Custom class names for select elements. */
  classNames?: {
    /** Class names passed to the SelectField. */
    field?: SelectFieldProps['classNames'];
    /** Class names passed to each OptionsItem. */
    optionItem: OptionsItemProps<OptionsDataItem>['classNames'];
  };
};

/**
 * Props for the CarouselGallery thumbnail strip component.
 */
export type CarouselGalleryProps = {
  /** Custom class names for gallery elements. */
  classNames?: {
    /** Class name for the gallery container. */
    container?: string;
    /** Class name for individual gallery items. */
    item?: string;
  };
};

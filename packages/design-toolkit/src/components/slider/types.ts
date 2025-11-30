/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import type {
  SliderProps as AriaSliderProps,
  InputProps,
  LabelProps,
  SliderThumbProps,
  SliderTrackProps,
} from 'react-aria-components';

export type SliderMarker = {
  value: number;
  label?: string;
};

export type SliderMarkersConfig =
  | number // Number of evenly spaced markers (includes min/max)
  | SliderMarker[] // Explicit marker positions with optional labels
  | number[]; // Array of values without labels

export type SliderProps = Omit<AriaSliderProps, 'children' | 'className'> & {
  classNames?: {
    slider?: AriaSliderProps['className'];
    label?: LabelProps['className'];
    inputs?: string;
    input?: InputProps['className'];
    track?: SliderTrackProps['className'];
    trackBackground?: string;
    trackValue?: string;
    thumb?: SliderThumbProps['className'];
    minValue?: string;
    maxValue?: string;
    markers?: string;
    marker?: string;
    markerDot?: string;
    markerLabel?: string;
  };
  label: string;
  layout?: 'grid' | 'stack';
  /**
   * Configure discrete marker points on the slider track.
   * - number: Creates evenly spaced markers (e.g., 5 creates markers at 0%, 25%, 50%, 75%, 100%)
   * - number[]: Array of specific values to mark
   * - SliderMarker[]: Array of objects with value and optional label
   */
  markers?: SliderMarkersConfig;
  /**
   * Whether to display numeric input fields for direct value entry
   */
  showInput?: boolean;
  showLabel?: boolean;
  /**
   * Whether to show labels on markers (only applies when markers have labels)
   */
  showMarkerLabels?: boolean;
  /**
   * When true, the slider can only be set to marker values.
   * Requires markers to be defined. The slider will snap to the nearest marker.
   */
  snapToMarkers?: boolean;
};

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
  };
  label: string;
  layout?: 'grid' | 'stack';
  showInput?: boolean;
  showLabel?: boolean;
};

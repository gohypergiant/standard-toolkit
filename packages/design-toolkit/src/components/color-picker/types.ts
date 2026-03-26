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
import type { Rgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
import type { RefAttributes } from 'react';
import type {
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
  ColorSwatchProps,
  LabelProps,
} from 'react-aria-components';

/**
 * Props for the ColorPicker component.
 */
export type ColorPickerProps = Omit<
  ColorSwatchPickerProps,
  'children' | 'defaultValue' | 'layout' | 'value'
> &
  RefAttributes<HTMLDivElement> & {
    /** Custom class names for sub-elements. */
    classNames?: {
      /** Class name for the outer container element. */
      container?: string;
      /** Class name for the label element. */
      label?: LabelProps['className'];
      /** Class name for the picker container. */
      picker?: ColorSwatchPickerProps['className'];
      /** Class name for individual swatch items. */
      item?: ColorSwatchPickerItemProps['className'];
      /** Class name for the color swatch elements. */
      swatch?: ColorSwatchProps['className'];
    };
    /** Default selected color value. Accepts a color string, Color object, or RGBA 255 tuple. */
    defaultValue?: ColorSwatchPickerProps['defaultValue'] | Rgba255Tuple;
    /** Controlled selected color value. Accepts a color string, Color object, or RGBA 255 tuple. */
    value?: ColorSwatchPickerProps['defaultValue'] | Rgba255Tuple;
    /** Array of color values to display as selectable swatches. Accepts color strings, Color objects, or RGBA 255 tuples. */
    items: (ColorSwatchPickerItemProps['color'] | Rgba255Tuple)[];
    /** Whether the associated field is required. */
    isRequired?: boolean;
    /** Label text displayed above the picker. */
    label?: string;
  };

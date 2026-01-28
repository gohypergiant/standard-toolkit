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
import type { RefAttributes } from 'react';
import type {
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
  ColorSwatchProps,
} from 'react-aria-components';

/**
 * Props for the ColorPicker component.
 */
export type ColorPickerProps = Omit<
  ColorSwatchPickerProps,
  'children' | 'layout'
> &
  RefAttributes<HTMLDivElement> & {
    /** Custom class names for sub-elements. */
    classNames?: {
      /** Class name for the picker container. */
      picker?: ColorSwatchPickerProps['className'];
      /** Class name for individual swatch items. */
      item?: ColorSwatchPickerItemProps['className'];
      /** Class name for the color swatch elements. */
      swatch?: ColorSwatchProps['className'];
    };
    /** Array of color values to display as selectable swatches. */
    items: ColorSwatchPickerItemProps['color'][];
  };

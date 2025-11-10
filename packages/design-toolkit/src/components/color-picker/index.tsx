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
'use client';

import 'client-only';
import {
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  composeRenderProps,
} from 'react-aria-components';
import { ColorPickerStyles } from './styles';
import type { ColorPickerProps } from './types';

const { picker, item, swatch } = ColorPickerStyles();

/**
 * A color picker component that renders a grid of color swatches for selection.
 *
 * This component provides a simple interface for users to select from a predefined
 * set of colors. It renders each color as an interactive swatch that can be clicked
 * to select that color. The component supports keyboard navigation, accessibility
 * features, and fine-grained styling control through the classNames prop.
 *
 * @param items - Array of color values to display as selectable swatches
 * @param classNames - Object containing CSS class names for fine-grained styling control
 * @param classNames.picker - CSS class name for the main picker container
 * @param classNames.item - CSS class name for individual swatch items
 * @param classNames.swatch - CSS class name for the color swatch elements
 *
 * @example
 * ```tsx
 * const colors = [
 *   '#ff0000',
 *   '#00ff00',
 *   '#0000ff',
 * ];
 *
 * <ColorPicker
 *   options={colors}
 *   value={'#ff0000'}
 *   onChange={(color) => console.log('Selected:', color)}
 *   classNames={{
 *     picker: 'gap-4',
 *     item: 'rounded-lg',
 *     swatch: 'w-8 h-8'
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Colors can be provided as Color objects or color strings
 * - The component automatically handles color parsing and validation
 * - Supports all accessibility features from react-aria-components
 * - Uses a grid layout by default but can be customized via the layout prop
 */
export function ColorPicker({ classNames, items, ...rest }: ColorPickerProps) {
  return (
    <ColorSwatchPicker
      {...rest}
      className={composeRenderProps(classNames?.picker, (className) =>
        picker({ className }),
      )}
    >
      {items.map((color) => (
        <ColorSwatchPickerItem
          key={color.toString('hexa')}
          className={composeRenderProps(classNames?.item, (className) =>
            item({ className }),
          )}
          color={color}
        >
          <ColorSwatch
            className={composeRenderProps(classNames?.swatch, (className) =>
              swatch({ className }),
            )}
          />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  );
}

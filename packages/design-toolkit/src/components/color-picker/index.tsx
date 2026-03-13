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
'use client';

import 'client-only';
import { rgba255TupleToHex } from '@accelint/converters/hex';
import { uuid } from '@accelint/core';
import { clsx } from '@accelint/design-foundation/lib/utils';
import { isRgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
import { useMemo } from 'react';
import {
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  composeRenderProps,
} from 'react-aria-components';
import { Label } from '../label';
import styles from './styles.module.css';
import type { ColorPickerProps } from './types';

/**
 * A color picker component that renders a grid of color swatches for selection.
 *
 * This component provides a simple interface for users to select from a predefined
 * set of colors. It renders each color as an interactive swatch that can be clicked
 * to select that color. The component supports keyboard navigation, accessibility
 * features, and fine-grained styling control through the classNames prop.
 *
 * @param props - The color picker props.
 * @param props.items - Array of color values to display as selectable swatches.
 * @param props.classNames - Custom class names for sub-elements.
 * @param props.classNames.container - Class name for the outer container element.
 * @param props.classNames.label - Class name for the label element.
 * @param props.classNames.picker - Class name for the picker container.
 * @param props.classNames.item - Class name for individual swatch items.
 * @param props.classNames.swatch - Class name for the color swatch elements.
 * @param props.label - Label text displayed above the picker.
 * @returns The color picker component.
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
 *   items={colors}
 *   value="#ff0000"
 *   onChange={(color) => console.log('Selected:', color)}
 *   classNames={{
 *     picker: 'gap-4',
 *     item: 'rounded-lg',
 *     swatch: 'w-8 h-8',
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
function normalizeColor(value: unknown) {
  return isRgba255Tuple(value) ? rgba255TupleToHex(value) : value;
}

export function ColorPicker({
  classNames,
  defaultValue,
  isRequired,
  items,
  label,
  ref,
  value,
  ...rest
}: ColorPickerProps) {
  const labelId = useMemo(
    () => (label ? uuid({ path: [label] }) : undefined),
    [label],
  );
    
  return (
    <div ref={ref} className={clsx(styles.container, classNames?.container)}>
      {label && (
        <Label
          className={classNames?.label}
          id={labelId}
          isRequired={isRequired}
        >
          {label}
        </Label>
      )}
      <ColorSwatchPicker
        {...rest}
        aria-labelledby={labelId}
        defaultValue={normalizeColor(defaultValue)}
        value={normalizeColor(value)}
        className={composeRenderProps(classNames?.picker, (className) =>
          clsx(styles.picker, className),
        )}
      >
        {items.map((item) => {
          const color = normalizeColor(item);
          return (
            <ColorSwatchPickerItem
              key={typeof color === 'string' ? color : color.toString('hexa')}
              className={composeRenderProps(classNames?.item, (className) =>
                clsx(styles.item, className),
              )}
              color={color}
            >
            <ColorSwatch
              className={composeRenderProps(classNames?.swatch, (className) =>
                clsx(styles.swatch, className),
              )}
            />
          </ColorSwatchPickerItem>
        );
        ))}
      </ColorSwatchPicker>
    </div>
  );
}

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
import {
  isRgba255Tuple,
  type Rgba255Tuple,
} from '@accelint/predicates/is-rgba-255-tuple';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import {
  type Color,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  parseColor,
  type ColorSwatchPickerProps,
} from 'react-aria-components/ColorSwatchPicker';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { Label } from '../label';
import { CustomColorPicker } from './custom-color-picker';
import { NoColorButton } from './no-color-button';
import styles from './styles.module.css';
import type { ColorPickerProps } from './types';

const DEFAULT_CUSTOM_COLOR = parseColor('#ECECE6');
const TRANSPARENT_COLOR = parseColor('rgba(0, 0, 0, 0)');

/**
 * Normalizes supported color inputs for picker state and React Aria color props.
 *
 * @param value - A color string, React Aria Color object, RGBA 255 tuple, or undefined.
 * @returns The original value, converting RGBA 255 tuples to hex strings.
 */
function normalizeColor(value: string | Color | Rgba255Tuple): string | Color;
function normalizeColor(
  value: string | Color | Rgba255Tuple | undefined,
): string | Color | undefined;
function normalizeColor(
  value: string | Color | Rgba255Tuple | undefined,
): string | Color | undefined {
  return isRgba255Tuple(value) ? rgba255TupleToHex(value) : value;
}

function toColor(value: string | Color): Color {
  return typeof value === 'string' ? parseColor(value) : value;
}

function getColorKey(value: string | Color | Rgba255Tuple | undefined) {
  const normalizedValue = normalizeColor(value);

  if (normalizedValue === undefined) {
    return undefined;
  }

  return toColor(normalizedValue).toString('hexa');
}

function resolveStaticPickerClassName(
  className: ColorSwatchPickerProps['className'] | undefined,
) {
  if (typeof className === 'function') {
    return className({} as never);
  }

  return className;
}

function getSelectionKind(
  currentValue: string | Color | undefined,
  isSwatchSelection: boolean,
) {
  if (currentValue === undefined) {
    return 'none';
  }

  return isSwatchSelection ? 'swatch' : 'custom';
}

function renderSwatchItems(
  items: { color: string | Color; key: string }[],
  classNames: ColorPickerProps['classNames'],
) {
  return items.map((item) => (
    <ColorSwatchPickerItem
      key={item.key}
      className={composeRenderProps(classNames?.item, (className) =>
        clsx(styles.item, className),
      )}
      color={item.color}
    >
      <ColorSwatch
        className={composeRenderProps(classNames?.swatch, (className) =>
          clsx(styles.swatch, className),
        )}
      />
    </ColorSwatchPickerItem>
  ));
}

function renderPickerContent({
  allowEmptySelection,
  classNames,
  currentColor,
  defaultValue,
  handleCustomColorChange,
  handleNoColorClick,
  handleSwatchChange,
  hasExtraButtons,
  isControlled,
  labelId,
  lastCustomColor,
  rest,
  selectionKind,
  showCustomPicker,
  swatchItems,
}: {
  allowEmptySelection?: boolean;
  classNames?: ColorPickerProps['classNames'];
  currentColor: Color | undefined;
  defaultValue: ColorPickerProps['defaultValue'];
  handleCustomColorChange: (newColor: Color) => void;
  handleNoColorClick: () => void;
  handleSwatchChange: (newValue: string | Color) => void;
  hasExtraButtons: boolean | undefined;
  isControlled: boolean;
  labelId: string | undefined;
  lastCustomColor: Color;
  rest: Omit<
    ColorPickerProps,
    | 'allowEmptySelection'
    | 'classNames'
    | 'defaultValue'
    | 'isRequired'
    | 'items'
    | 'label'
    | 'onChange'
    | 'ref'
    | 'showCustomPicker'
    | 'value'
  >;
  selectionKind: 'none' | 'swatch' | 'custom';
  showCustomPicker?: boolean;
  swatchItems: ReactElement[];
}) {
  if (hasExtraButtons) {
    return (
      <div
        className={clsx(
          styles.picker,
          resolveStaticPickerClassName(classNames?.picker),
        )}
      >
        {allowEmptySelection && (
          <NoColorButton
            isActive={selectionKind === 'none'}
            onClick={handleNoColorClick}
          />
        )}

        <ColorSwatchPicker
          {...rest}
          aria-labelledby={labelId}
          className={classNames?.picker}
          value={
            selectionKind === 'swatch' && currentColor !== undefined
              ? currentColor
              : TRANSPARENT_COLOR
          }
          onChange={handleSwatchChange}
          layout='grid'
          style={{ display: 'contents' }}
        >
          {swatchItems}
        </ColorSwatchPicker>

        {showCustomPicker && (
          <CustomColorPicker
            isActive={selectionKind === 'custom'}
            colorValue={
              selectionKind === 'custom' && currentColor !== undefined
                ? currentColor
                : lastCustomColor
            }
            onChange={handleCustomColorChange}
          />
        )}
      </div>
    );
  }

  return (
    <ColorSwatchPicker
      {...rest}
      aria-labelledby={labelId}
      {...(isControlled
        ? { value: currentColor }
        : { defaultValue: normalizeColor(defaultValue) })}
      onChange={handleSwatchChange}
      className={composeRenderProps(classNames?.picker, (className) =>
        clsx(styles.picker, className),
      )}
    >
      {swatchItems}
    </ColorSwatchPicker>
  );
}

/**
 * Renders a color swatch picker with optional empty-selection and custom-color controls.
 *
 * @param props - The color picker props.
 * @param props.allowEmptySelection - Whether to show a button that clears the current selection.
 * @param props.classNames - Custom class names for color picker sub-elements.
 * @param props.classNames.container - Class name for the outer container element.
 * @param props.classNames.label - Class name for the label element.
 * @param props.classNames.picker - Class name for the swatch picker container.
 * @param props.classNames.item - Class name for each swatch picker item.
 * @param props.classNames.swatch - Class name for each rendered color swatch.
 * @param props.defaultValue - Initial selected color for uncontrolled usage.
 * @param props.isRequired - Whether the associated field is required.
 * @param props.items - Color values to render as selectable swatches.
 * @param props.label - Label text displayed above the picker.
 * @param props.ref - Ref forwarded to the root container element.
 * @param props.showCustomPicker - Whether to show the custom color picker control.
 * @param props.value - Controlled selected color value.
 * @param props.onChange - Called when the selected color changes or is cleared.
 * @returns The rendered color picker component.
 *
 * @remarks
 * Supports color strings, React Aria Color objects, and RGBA 255 tuples through prop normalization.
 *
 * @example
 * ```tsx
 * const colors = ['#ff0000', '#00ff00', '#0000ff'];
 *
 * <ColorPicker
 *   items={colors}
 *   value="#ff0000"
 *   onChange={(color) => {
 *     console.log('Selected color:', color);
 *   }}
 *   classNames={{
 *     picker: 'gap-4',
 *     item: 'rounded-lg',
 *     swatch: 'size-8',
 *   }}
 * />
 * ```
 */
export function ColorPicker(props: ColorPickerProps) {
  const {
    allowEmptySelection,
    classNames,
    defaultValue,
    isRequired,
    items,
    label,
    ref,
    showCustomPicker,
    value,
    onChange,
    ...rest
  } = props;

  const isControlled = Object.hasOwn(props, 'value');

  const labelId = useMemo(
    () => (label ? uuid({ path: [label] }) : undefined),
    [label],
  );

  const normalizedItems = useMemo(
    () =>
      items.map((item) => {
        const color = normalizeColor(item);

        return {
          color,
          key: toColor(color).toString('hexa'),
        };
      }),
    [items],
  );

  const [internalValue, setInternalValue] = useState<
    string | Color | undefined
  >(() => normalizeColor(defaultValue));

  const [lastCustomColor, setLastCustomColor] = useState<Color>(() => {
    const initialColor =
      normalizeColor(isControlled ? value : defaultValue) ??
      normalizedItems[0]?.color ??
      DEFAULT_CUSTOM_COLOR;

    return toColor(initialColor);
  });

  const currentValue = isControlled ? normalizeColor(value) : internalValue;
  const currentValueKey = getColorKey(currentValue);
  const currentColor = useMemo(() => {
    if (currentValue === undefined) {
      return undefined;
    }

    return toColor(currentValue);
  }, [currentValue]);
  const isSwatchSelection =
    currentValueKey !== undefined &&
    normalizedItems.some((item) => item.key === currentValueKey);
  const selectionKind = getSelectionKind(currentValue, isSwatchSelection);
  const lastCustomColorKey = lastCustomColor.toString('hexa');
  const shouldSyncLastCustomColor =
    selectionKind === 'custom' &&
    currentColor !== undefined &&
    currentValueKey !== undefined &&
    currentValueKey !== lastCustomColorKey;

  useEffect(() => {
    if (shouldSyncLastCustomColor && currentColor !== undefined) {
      setLastCustomColor(currentColor);
    }
  }, [currentColor, shouldSyncLastCustomColor]);

  const updateInternalValue = (nextValue: string | Color | undefined) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
  };

  const handleNoColorClick = () => {
    updateInternalValue(undefined);
    onChange?.(undefined);
  };

  const handleSwatchChange = (newValue: string | Color) => {
    const nextColor = toColor(newValue);

    updateInternalValue(nextColor);
    onChange?.(nextColor);
  };

  const handleCustomColorChange = (newColor: Color) => {
    updateInternalValue(newColor);
    setLastCustomColor(newColor);
    onChange?.(newColor);
  };

  const hasExtraButtons = allowEmptySelection || showCustomPicker;
  const swatchItems = renderSwatchItems(normalizedItems, classNames);

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
      {renderPickerContent({
        allowEmptySelection,
        classNames,
        currentColor,
        defaultValue,
        handleCustomColorChange,
        handleNoColorClick,
        handleSwatchChange,
        hasExtraButtons,
        isControlled,
        labelId,
        lastCustomColor,
        rest,
        selectionKind,
        showCustomPicker,
        swatchItems,
      })}
    </div>
  );
}

export { CustomColorPicker } from './custom-color-picker';
export { NoColorButton } from './no-color-button';

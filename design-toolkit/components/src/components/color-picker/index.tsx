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
import { cn } from '@/lib/utils';
import { useControlledState } from '@react-stately/utils';
import 'client-only';
import {
  type ForwardedRef,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  ColorSwatch as AriaColorSwatch,
  ColorSwatchContext as AriaColorSwatchContext,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type Color,
  ColorSwatchPickerContext,
  parseColor,
  useContextProps,
  useLocale,
} from 'react-aria-components';

interface ColorPickerState {
  /** The current color value of the color picker. */
  color: Color | null;
  /** Sets the current color value of the color picker. */
  setColor(color: Color | null): void;
}

const parseColorFromProp = (value?: Color | string) => {
  if (typeof value === 'string') {
    try {
      return parseColor(value);
    } catch {
      return undefined;
    }
  }
  return value;
};

export function useColorPickerState(
  props: AriaColorSwatchPickerProps,
): ColorPickerState {
  const value = useMemo(() => parseColorFromProp(props.value), [props.value]);

  const defaultValue = useMemo(
    () => parseColorFromProp(props.defaultValue || '#000000'),
    [props.defaultValue],
  );
  const [color, setColor] = useControlledState(
    value || null,
    defaultValue as Color,
    props.onChange,
  );

  return {
    color,
    setColor(color) {
      setColor(color);
    },
  };
}

/**
 * Renders a single color swatch item for use within a color picker list.
 *
 * This component manages the registration of its color value in a shared color map context,
 * and provides the color value to its children via context. It also handles accessibility
 * and styling for selection and focus states.

 *
 * @remarks
 * - The component registers its color in a shared `ColorMapContext` on mount and removes it on unmount.
 * - The color is parsed and memoized for performance.
 * - The swatch item is rendered as an accessible list box item.
 */
function ColorSwatchPickerItem({
  ref = null,
  color: colorFromProps,
  ...props
}: Omit<AriaColorSwatchPickerItemProps, 'style'> & {
  children: ReactNode;
  ref?: ForwardedRef<HTMLDivElement>;
}) {
  const propColor = colorFromProps || '#0000';
  const color = useMemo(
    () => (typeof propColor === 'string' ? parseColor(propColor) : propColor),
    [propColor],
  );
  const { locale } = useLocale();
  const map = useContext(ColorMapContext);

  // Register the color in the map context on mount and remove it on unmount.
  // This allows the color picker to manage its own state and selection.
  // The key is the color's hex representation, ensuring uniqueness.
  // The color is also provided to the context for use by children components.
  // This is useful for rendering the swatch or any related UI elements.
  useEffect(() => {
    const key = color.toString('hexa');
    map?.set(key, color);
    return () => {
      map?.delete(key);
    };
  }, [color, map]);

  return (
    <AriaListBoxItem
      {...props}
      ref={ref}
      id={color.toString('hexa')}
      textValue={color.getColorName(locale)}
      className='w-fit outline-none outline outline-offset-1 hover:outline-interactive-hover hover:outline-solid focus:outline-interactive-hover focus:outline-solid data-selected:outline-highlight data-selected:outline-solid'
    >
      <AriaColorSwatchContext.Provider value={{ color }}>
        {props.children}
      </AriaColorSwatchContext.Provider>
    </AriaListBoxItem>
  );
}

const ColorMapContext = createContext<Map<string, Color> | null>(null);

export interface ColorPickerProps extends AriaColorSwatchPickerProps {
  options: AriaColorSwatchPickerItemProps['color'][];
  ref?: ForwardedRef<HTMLDivElement>;
}

interface ColorSwatchPickerProps extends Omit<ColorPickerProps, 'options'> {
  children?: ReactNode;
}

function ColorSwatchPicker({
  ref = null,
  className,
  children,
  ...props
}: ColorSwatchPickerProps) {
  [props, ref] = useContextProps(props, ref, ColorSwatchPickerContext);
  const state = useColorPickerState(props);
  const colorMap = useMemo(() => new Map(), []);
  return (
    <AriaListBox
      className={cn('flex flex-wrap gap-s', className)}
      style={props.style}
      layout={props.layout || 'grid'}
      selectionMode='single'
      selectedKeys={state.color ? [state.color.toString('hexa')] : undefined}
      onSelectionChange={(keys) => {
        // single select, 'all' cannot occur.
        if (keys !== 'all') {
          if (keys.size > 0) {
            state.setColor(colorMap.get([...keys][0]));
          } else {
            // If no keys are selected, we can set the color to null or a default value
            state.setColor(null);
          }
        }
      }}
      {...props}
    >
      <ColorMapContext.Provider value={colorMap}>
        {children}
      </ColorMapContext.Provider>
    </AriaListBox>
  );
}

export function ColorPicker({
  options,
  className,
  ...props
}: ColorPickerProps) {
  return (
    <ColorSwatchPicker
      className={cn('flex flex-wrap gap-s', className)}
      {...props}
    >
      {options.map((color) => (
        <ColorSwatchPickerItem key={color.toString()} color={color}>
          <AriaColorSwatch className='h-[16px] w-[16px]' />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  );
}
ColorPicker.displayName = 'ColorPicker';

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
import { ColorPicker as ColorPickerIcon } from '@accelint/icons';
import { useState } from 'react';
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorThumb,
  Input,
  Label,
  SliderTrack,
} from 'react-aria-components';
import { Button } from '../button';
import { DialogContent } from '../dialog/content';
import { DialogTrigger } from '../dialog/trigger';
import { Icon } from '../icon';
import { Popover } from '../popover';
import styles from './styles.module.css';
import type { CustomColorPickerProps } from './custom-color-picker.types';

/**
 * CustomColorPicker - A color picker with full HSB and RGB controls.
 *
 * Provides a comprehensive color selection interface with a 2D saturation/brightness
 * gradient area, hue slider, and RGB input fields. Opens in a popover when
 * the trigger button is clicked.
 *
 * @param props - {@link CustomColorPickerProps}
 * @param props.colorValue - The current color value.
 * @param props.isActive - Whether this picker is the active selection source.
 * @param props.isDisabled - Whether the button is disabled.
 * @param props.onChange - Change handler callback when color is updated.
 * @param props.className - Additional CSS class name for the trigger button.
 * @returns The CustomColorPicker component.
 *
 * @example
 * ```tsx
 * const [color, setColor] = useState(parseColor('#ff0000'));
 *
 * <CustomColorPicker
 *   colorValue={color}
 *   onChange={setColor}
 * />
 * ```
 */
export function CustomColorPicker({
  colorValue,
  isActive,
  isDisabled,
  onChange,
}: Readonly<CustomColorPickerProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant='icon'
        size='xsmall'
        isDisabled={isDisabled}
        aria-label='Open custom color picker'
        data-selected={isActive || null}
        className={styles.customColorButton}
      >
        <Icon>
          <ColorPickerIcon color={colorValue.toString('hex')} />
        </Icon>
      </Button>

      <Popover placement='bottom start'>
        <DialogContent className='flex min-w-[220px] flex-col gap-m'>
          <ColorPicker
            value={colorValue}
            onChange={(color) => onChange(color.toFormat('rgb'))}
          >
            <ColorArea
              colorSpace='hsb'
              xChannel='saturation'
              yChannel='brightness'
              className={styles.colorArea}
            >
              <ColorThumb className={styles.colorThumb} />
            </ColorArea>

            <ColorSlider
              colorSpace='hsb'
              channel='hue'
              className={styles.hueSlider}
            >
              <SliderTrack className={styles.hueSliderTrack}>
                <ColorThumb className={styles.hueSliderThumb} />
              </SliderTrack>
            </ColorSlider>

            <div className={styles.rgbFieldsContainer}>
              {(['red', 'green', 'blue'] as const).map((channel) => (
                <ColorField
                  key={channel}
                  colorSpace='rgb'
                  channel={channel}
                  className={styles.rgbField}
                >
                  <Label className={styles.rgbFieldLabel}>
                    {channel.charAt(0).toUpperCase()}
                  </Label>
                  <Input
                    className={styles.rgbFieldInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                  />
                </ColorField>
              ))}
            </div>
          </ColorPicker>
        </DialogContent>
      </Popover>
    </DialogTrigger>
  );
}

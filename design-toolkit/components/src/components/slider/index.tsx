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
import 'client-only';
import { useContext } from 'react';
import {
  Input,
  Label,
  LabelContext,
  NumberField,
  Slider as RACSlider,
  SliderTrack as RACSliderTrack,
  SliderStateContext,
  SliderThumb,
  Text,
  useSlottedContext,
} from 'react-aria-components';
import { Tooltip } from '../tooltip';
import { MaxValueStyles, MinValueStyles, SliderStyles } from './styles';
import type { SliderProps } from './types';

const {
  slider,
  label: sliderLabel,
  trackValue,
  input,
  track,
  trackBackground,
  thumb,
} = SliderStyles();

/**
 * Slider - An interactive range input component for numeric value selection
 *
 * Provides accessible slider functionality with optional input field integration,
 * flexible layouts, and comprehensive keyboard and mouse interaction support.
 * Perfect for settings, filters, or any numeric input requiring visual feedback.
 *
 * @example
 * // Basic slider
 * <Slider label="Volume" defaultValue={50} />
 */
export const Slider = ({
  children,
  className,
  showInput = false,
  showLabel = true,
  layout = 'stack',
  value,
  defaultValue,
  label,
  minValue = 0,
  maxValue = 100,
  orientation = 'horizontal',
  ...props
}: SliderProps) => {
  return (
    <RACSlider
      className={slider()}
      minValue={minValue}
      maxValue={maxValue}
      data-layout={layout}
      orientation={orientation}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      {showLabel && <Label className={sliderLabel()}>{label}</Label>}
      {showInput && (
        <div className={input()}>
          <SliderInput />
        </div>
      )}
      <RACSliderTrack className={track()}>
        {({ state }) => {
          const minValue = state.getThumbPercent(0);
          const maxValue = state.getThumbPercent(1) || minValue;
          const sizeInPercent = `${(state.values.length === 2 ? maxValue - minValue : minValue) * 100}%`;
          const startPercent =
            state.values.length === 2 ? `${Math.floor(minValue * 100)}%` : '0';
          return (
            <>
              <div className={trackBackground()} />
              {state.values.map((_, index) => {
                return (
                  <>
                    <div
                      key={`slider-${index === 0 ? 'min' : 'max'}`}
                      className={trackValue()}
                      style={
                        orientation === 'horizontal'
                          ? {
                              left: startPercent,
                              width: sizeInPercent,
                            }
                          : {
                              bottom: startPercent,
                              height: sizeInPercent,
                            }
                      }
                    />

                    <SliderThumb
                      key={`slider-thumb-${index === 0 ? 'min' : 'max'}`}
                      index={index}
                      className={thumb()}
                    >
                      {!showInput && (
                        <Tooltip>
                          <Tooltip.Trigger>
                            <div className='size-full outline-none' />
                          </Tooltip.Trigger>
                          <Tooltip.Body placement='top'>
                            {state.getThumbValue(index)}
                          </Tooltip.Body>
                        </Tooltip>
                      )}
                    </SliderThumb>
                  </>
                );
              })}
            </>
          );
        }}
      </RACSliderTrack>
      <Text slot='min' className={MinValueStyles()}>
        {minValue}
      </Text>
      <Text slot='max' className={MaxValueStyles()}>
        {maxValue}
      </Text>
    </RACSlider>
  );
};

function SliderInput({ className }: { className?: string }) {
  const state = useContext(SliderStateContext);
  const labelProps = useSlottedContext(LabelContext);
  return (
    <>
      {state?.values.map((value: number, index: number) => (
        <NumberField
          key={`number-field-${index === 0 ? 'min' : 'max'}`}
          aria-labelledby={labelProps?.id}
          value={value}
          onChange={(v) => state.setThumbValue(0, v)}
        >
          <Input
            className={cn(
              'w-[50px] rounded-medium border border-interactive px-s py-xs font-display text-body-m text-default-light',
              className,
            )}
          />
        </NumberField>
      ))}
    </>
  );
}

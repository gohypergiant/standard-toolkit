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
import { cva } from 'class-variance-authority';
import { useContext } from 'react';
import {
  Input,
  Label,
  LabelContext,
  NumberField,
  Slider as RACSlider,
  type SliderProps as RACSliderProps,
  SliderTrack as RACSliderTrack,
  SliderStateContext,
  SliderThumb,
  Text,
  useSlottedContext,
} from 'react-aria-components';
import { Tooltip } from '../tooltip';

const sliderVariants = cva('grid gap-s', {
  variants: {
    layout: {
      stacked: '',
      inline: '',
    },
    orientation: {
      vertical: 'h-full w-fit',
      horizontal: 'h-xl w-full',
    },
  },
  compoundVariants: [
    {
      layout: 'stacked',
      orientation: 'horizontal',
      className: 'grid-cols-[auto_1fr_auto] grid-rows-[auto_auto_auto]',
    },
    {
      layout: 'inline',
      orientation: 'horizontal',
      className: 'grid-cols-[auto_auto_1fr_auto_auto] grid-rows-1 items-center',
    },
    {
      layout: 'stacked',
      orientation: 'vertical',
      className: 'grid-cols-[auto_auto_auto] grid-rows-[auto_auto_1fr_auto]',
    },
    {
      layout: 'inline',
      orientation: 'vertical',
      className: 'grid-cols-[auto_1fr_auto] grid-rows-[auto_auto_1fr_auto]',
    },
  ],
});

const minValueVariants = cva('font-display text-body-m text-default-dark', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'col-start-1 row-start-4',
    },
    layout: {
      inline: '',
      stacked: '',
    },
  },
  compoundVariants: [
    {
      layout: 'stacked',
      orientation: 'horizontal',
      className: 'col-start-1 row-start-3',
    },
    {
      layout: 'inline',
      orientation: 'horizontal',
      className: 'order-2',
    },
    {
      layout: 'stacked',
      orientation: 'vertical',
      className: 'self-end justify-self-end',
    },
    {
      layout: 'inline',
      orientation: 'vertical',
      className: 'justify-self-center',
    },
  ],
});

const maxValueVariants = cva('font-display text-body-m text-default-dark', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'col-start-1 row-start-2',
    },
    layout: {
      inline: '',
      stacked: '',
    },
  },
  compoundVariants: [
    {
      layout: 'stacked',
      orientation: 'horizontal',
      className: 'col-start-3 row-start-3 justify-self-end',
    },
    {
      layout: 'inline',
      orientation: 'horizontal',
      className: 'order-4',
    },
    {
      layout: 'stacked',
      orientation: 'vertical',
      className: 'justify-self-end',
    },
  ],
});

const sliderTrackVariants = cva('relative', {
  variants: {
    orientation: {
      horizontal: 'h-s w-full',
      vertical: 'h-full w-s',
    },
    layout: {
      inline: '',
      stacked: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      layout: 'stacked',
      className: 'col-span-3 row-start-2',
    },
    {
      orientation: 'horizontal',
      layout: 'inline',
      className: 'order-3',
    },
    {
      orientation: 'vertical',
      layout: 'stacked',
      className: 'col-start-2 row-span-3 row-start-2',
    },
    {
      orientation: 'vertical',
      layout: 'inline',
      className: 'col-start-1 row-start-3 justify-self-center',
    },
  ],
});

const inputVariants = cva('flex gap-s', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col-reverse',
    },
    layout: {
      inline: 'order-5',
      stacked: 'col-start-3 row-start-1',
    },
  },
  compoundVariants: [
    {
      layout: 'inline',
      orientation: 'horizontal',
      className: 'order-5',
    },
    {
      layout: 'inline',
      orientation: 'vertical',
      className: 'col-span-3 col-start-1',
    },
    {
      layout: 'stacked',
      orientation: 'vertical',
      className: 'row-start-4',
    },
  ],
});

const labelVariants = cva('text-default-light', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: '',
    },
    layout: {
      inline: 'order-1',
      stacked: 'col-start-1',
    },
  },
  compoundVariants: [
    {
      layout: 'stacked',
      orientation: 'vertical',
      className: 'col-span-2',
    },
    {
      layout: 'inline',
      orientation: 'vertical',
      className: 'col-span-3',
    },
  ],
});

const sliderThumbVariants = cva(
  'h-m w-m rounded-full bg-highlight-bold outline-highlight-bold/40 hover:outline-4 focus:outline-4',
  {
    variants: {
      orientation: {
        horizontal: 'translate-y-[50%]',
        vertical: 'translate-x-[40%]',
      },
    },
  },
);

const sliderTrackBackgroundVariants = cva(
  'absolute rounded-full bg-default-light/40',
  {
    variants: {
      orientation: {
        horizontal: 'top-[50%] h-xxs w-full translate-y-[50%]',
        vertical: 'left-[50%] h-full w-xxs ',
      },
    },
  },
);

const sliderTrackValueVariants = cva('absolute rounded-full bg-highlight', {
  variants: {
    orientation: {
      horizontal: 'top-1/2 h-xxs translate-y-1/2',
      vertical: 'left-1/2 w-xxs',
    },
  },
});

export interface SliderProps
  extends Omit<
    RACSliderProps,
    'value' | 'defaultValue' | 'showOutput' | 'slot' | 'style' | 'formatOptions'
  > {
  className?: string;
  showInput?: boolean;
  showLabel?: boolean;
  layout?: 'stacked' | 'inline';
  value?: number;
  defaultValue?: number;
  rangeValue?: [number, number];
  defaultRangeValue?: [number, number];
  isRange?: boolean;
  label: string;
}

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
  layout = 'stacked',
  value,
  defaultValue,
  label,
  defaultRangeValue,
  rangeValue,
  minValue = 0,
  maxValue = 100,
  isRange = false,
  orientation = 'horizontal',
  ...props
}: SliderProps) => {
  const sliderValue = isRange ? rangeValue : value;
  const sliderDefaultValue = isRange ? defaultRangeValue : defaultValue;

  return (
    <RACSlider
      className={cn(sliderVariants({ orientation, layout }))}
      minValue={minValue}
      maxValue={maxValue}
      orientation={orientation}
      value={sliderValue}
      defaultValue={sliderDefaultValue}
      {...props}
    >
      {showLabel && (
        <Label className={labelVariants({ orientation, layout })}>
          {label}
        </Label>
      )}
      {showInput && (
        <div className={inputVariants({ orientation, layout })}>
          <SliderInput />
        </div>
      )}
      <RACSliderTrack className={sliderTrackVariants({ layout, orientation })}>
        {({ state }) => {
          const minValue = state.getThumbPercent(0);
          const maxValue = state.getThumbPercent(1) || minValue;
          const sizeInPercent = `${(state.values.length === 2 ? maxValue - minValue : minValue) * 100}%`;
          const startPercent =
            state.values.length === 2 ? `${Math.floor(minValue * 100)}%` : '0';
          return (
            <>
              <div className={sliderTrackBackgroundVariants({ orientation })} />
              {state.values.map((_, index) => {
                return (
                  <>
                    <div
                      key={`slider-${index === 0 ? 'min' : 'max'}`}
                      className={sliderTrackValueVariants({ orientation })}
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
                      className={sliderThumbVariants({ orientation })}
                    >
                      {!showInput && (
                        <Tooltip>
                          <Tooltip.Trigger>
                            <div className='size-full' />
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
      <Text slot='min' className={minValueVariants({ layout, orientation })}>
        {minValue}
      </Text>
      <Text slot='max' className={maxValueVariants({ layout, orientation })}>
        {maxValue}
      </Text>
    </RACSlider>
  );
};

export type RangeSliderProps = Omit<
  SliderProps,
  'isRange' | 'defaultRangeValue' | 'rangeValue' | 'defaultValue' | 'value'
> & {
  defaultValue?: SliderProps['defaultRangeValue'];
  value: SliderProps['rangeValue'];
};

/**
 * RangeSlider - A dual-handle slider component for selecting a range of numeric values
 *
 * Extends the base Slider component to provide range selection functionality with two thumbs,
 * allowing users to define both minimum and maximum values within a specified range.
 * Maintains all accessibility features and layout options of the base slider while
 * providing intuitive range selection controls.
 *
 * @example
 * // Basic range slider
 * <RangeSlider label="Price Range" defaultValue={[20, 80]} minValue={0} maxValue={100} />
 *
 * @example
 * // Controlled range slider with input fields
 * <RangeSlider
 *   label="Temperature Range"
 *   value={tempRange}
 *   onChange={setTempRange}
 *   showInput
 *   minValue={-10}
 *   maxValue={40}
 * />
 */
export const RangeSlider = ({
  defaultValue,
  value,
  ...props
}: RangeSliderProps) => {
  return (
    <Slider
      {...props}
      isRange
      defaultRangeValue={defaultValue}
      rangeValue={value}
    />
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

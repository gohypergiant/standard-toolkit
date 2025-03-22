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

import type { ArgTypes, Story, StoryDefault } from '@ladle/react';
import {
  Slider,
  SliderBar,
  SliderOutput,
  type SliderProps,
  SliderThumb,
  SliderTrack,
} from '.';
import { AriaLabel, AriaText } from '../aria';
import { Group } from '../group';
import { Input } from '../input';
import { NumberField } from '../number-field';
import type { SliderRenderProps } from './types';

type SliderStoryProps = SliderProps & {
  label: string;
  showInput: boolean;
  showLabel: boolean;
  showOutput: boolean;
};

export default {
  title: 'Components/Slider',
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

const args: ArgTypes<SliderStoryProps> = {
  label: {
    control: {
      type: 'text',
    },
    defaultValue: 'Opacity',
  },
  layout: {
    control: {
      type: 'select',
    },
    options: ['stacked', 'inline'],
    defaultValue: 'stacked',
  },
  orientation: {
    control: {
      type: 'select',
    },
    options: ['horizontal', 'vertical'],
    defaultValue: 'horizontal',
  },
  showInput: {
    control: {
      type: 'boolean',
    },
    defaultValue: true,
  },
  showLabel: {
    control: {
      type: 'boolean',
    },
    defaultValue: true,
  },
  minValue: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
  maxValue: {
    control: {
      type: 'number',
    },
    defaultValue: 100,
  },
};

export const RangeSliderExample: Story<SliderStoryProps> = ({
  label,
  minValue,
  maxValue,
  showLabel,
  showInput,
  showOutput,
  value,
  ...rest
}) => (
  <Slider
    minValue={minValue}
    maxValue={maxValue}
    defaultValue={[25, 75]}
    {...rest}
  >
    {({ state }) => {
      return (
        <>
          {showLabel && <AriaLabel>{label}</AriaLabel>}
          {showOutput && (
            <SliderOutput>
              <span>{state.values[0]}</span>
              {' - '}
              <span>{state.values[1]}</span>
            </SliderOutput>
          )}
          {showInput && (
            <Group>
              <NumberField
                value={state.values[0]}
                onChange={(v) => state.setThumbValue(0, v)}
              >
                <Input />
              </NumberField>
              <NumberField
                value={state.values[1]}
                onChange={(v) => state.setThumbValue(1, v)}
              >
                <Input />
              </NumberField>
            </Group>
          )}
          <SliderTrack>
            {({ state }: SliderRenderProps) => (
              <>
                <SliderBar />
                {state.values.map((_value: number, i: number) => (
                  <SliderThumb index={i} key={i} />
                ))}
              </>
            )}
          </SliderTrack>
          <AriaText slot='min'>{minValue || 0}</AriaText>
          <AriaText slot='max'>{maxValue || 100}</AriaText>
        </>
      );
    }}
  </Slider>
);

RangeSliderExample.storyName = 'Range / Uncontrolled';

RangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Range',
  },
};

// added inputValues to make Ladle controls easier to use
export const ControlledRangeSliderExample: Story<
  SliderStoryProps & {
    label: string;
    inputLow: number;
    inputHigh: number;
  }
> = ({
  label,
  value,
  minValue,
  maxValue,
  inputLow,
  inputHigh,
  showLabel,
  showInput,
  showOutput,
  ...rest
}) => (
  <Slider
    {...rest}
    value={[inputLow, inputHigh]}
    minValue={minValue}
    maxValue={maxValue}
  >
    {({ state }) => (
      <>
        {showLabel && <AriaLabel>{label}</AriaLabel>}
        {showOutput && (
          <SliderOutput>
            <span>{state.values[0]}</span>
            {' - '}
            <span>{state.values[1]}</span>
          </SliderOutput>
        )}
        {showInput && (
          <Group>
            <NumberField value={state.values[0]}>
              <Input />
            </NumberField>
            <NumberField value={state.values[1]}>
              <Input />
            </NumberField>
          </Group>
        )}
        <SliderTrack>
          {({ state }: SliderRenderProps) => (
            <>
              <SliderBar />
              {state.values.map((_value: number, i: number) => (
                <SliderThumb index={i} key={i} />
              ))}
            </>
          )}
        </SliderTrack>
        <AriaText slot='min'>{minValue || 0}</AriaText>
        <AriaText slot='max'>{maxValue || 100}</AriaText>
      </>
    )}
  </Slider>
);

ControlledRangeSliderExample.storyName = 'Range / Controlled';

ControlledRangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Range',
  },
  inputLow: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
  inputHigh: {
    control: {
      type: 'number',
    },
    defaultValue: 50,
  },
  showOutput: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

export const SliderExample: Story<SliderStoryProps> = ({
  label,
  minValue,
  maxValue,
  showLabel,
  showInput,
  showOutput,
  ...rest
}) => (
  <Slider minValue={minValue} maxValue={maxValue} {...rest}>
    {({ state }) => (
      <>
        {showLabel && <AriaLabel>{label}</AriaLabel>}
        {showOutput && (
          <SliderOutput>
            <span>{state.values[0]}</span>
          </SliderOutput>
        )}
        {showInput && (
          <NumberField
            value={state.values[0]}
            onChange={(v) => state.setThumbValue(0, v)}
          >
            <Input />
          </NumberField>
        )}
        <SliderTrack>
          {() => (
            <>
              <SliderBar />
              <SliderThumb />
            </>
          )}
        </SliderTrack>
        <AriaText slot='min'>{minValue || 0}</AriaText>
        <AriaText slot='max'>{maxValue || 100}</AriaText>
      </>
    )}
  </Slider>
);

SliderExample.storyName = 'Slider / With input';

SliderExample.argTypes = {
  ...args,
  showOutput: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

export const SliderExampleWithOutput: Story<SliderStoryProps> = ({
  label,
  minValue,
  maxValue,
  showLabel,
  showInput,
  ...rest
}) => (
  <Slider
    minValue={minValue}
    maxValue={maxValue}
    formatOptions={{ style: 'decimal' }}
    {...rest}
  >
    {({ state }) => (
      <>
        {showLabel && <AriaLabel>{label}</AriaLabel>}
        {showInput && (
          <SliderOutput>
            <span>{state.values[0]}</span>
          </SliderOutput>
        )}
        <SliderTrack>
          {() => (
            <>
              <SliderBar />
              <SliderThumb />
            </>
          )}
        </SliderTrack>
        <AriaText slot='min'>{minValue || 0}</AriaText>
        <AriaText slot='max'>{maxValue || 100}</AriaText>
      </>
    )}
  </Slider>
);

SliderExampleWithOutput.storyName = 'Slider / With output';

SliderExampleWithOutput.argTypes = {
  ...args,
  showOutput: {
    control: {
      type: 'boolean',
    },
    defaultValue: true,
  },
};

export const ControlledSliderExample: Story<SliderStoryProps> = ({
  label,
  minValue,
  maxValue,
  showLabel,
  showInput,
  showOutput,
  value,
  ...rest
}) => (
  <Slider {...rest} value={value} minValue={minValue} maxValue={maxValue}>
    {({ state }) => (
      <>
        {showLabel && <AriaLabel>{label}</AriaLabel>}
        {showInput && (
          <NumberField value={state.values[0]}>
            <Input />
          </NumberField>
        )}
        {showOutput && (
          <SliderOutput>
            <span>{state.values[0]}</span>
          </SliderOutput>
        )}
        <SliderTrack>
          {() => (
            <>
              <SliderBar />
              <SliderThumb />
            </>
          )}
        </SliderTrack>
        <AriaText slot='min'>{minValue || 0}</AriaText>
        <AriaText slot='max'>{maxValue || 100}</AriaText>
      </>
    )}
  </Slider>
);

ControlledSliderExample.storyName = 'Slider / Controlled';

ControlledSliderExample.argTypes = {
  ...args,
  label: {
    control: {
      type: 'text',
    },
    defaultValue: 'Opacity',
  },
  value: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
};

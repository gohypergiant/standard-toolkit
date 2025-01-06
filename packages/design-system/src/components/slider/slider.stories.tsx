import type { ArgTypes, Story, StoryDefault } from '@ladle/react';
import {
  Slider,
  SliderInput,
  SliderThumb,
  SliderTrack,
  type SliderProps,
} from '.';
import { AriaLabel, AriaText } from '../aria';
import { Input } from '../input';
import { TooltipTrigger } from 'react-aria-components';
import { Tooltip } from '../tooltip';
import { SliderBar } from './slider';

export default {
  title: 'Components/Slider',
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

const args: ArgTypes<SliderProps> = {
  label: {
    control: {
      type: 'text',
    },
    defaultValue: 'Slider label',
  },
  alignLabel: {
    control: {
      type: 'select',
    },
    options: ['top', 'left'],
    defaultValue: 'top',
  },
  includeTextField: {
    control: {
      type: 'boolean',
    },
    defaultValue: true,
  },
  includeRangeLabel: {
    control: {
      type: 'boolean',
    },
    defaultValue: true,
  },
  min: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
  max: {
    control: {
      type: 'number',
    },
    defaultValue: 100,
  },
};

export const SliderExample: Story<SliderProps> = ({
  label,
  min,
  max,
  includeRangeLabel,
  includeTextField,
  ...rest
}) => (
  <>
    <Slider {...rest}>
      {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
      {includeTextField && (
        <SliderInput>
          <Input value='' />
        </SliderInput>
      )}
      <SliderTrack>
        {({ state }) => (
          <TooltipTrigger>
            <SliderBar minValue={state.values[0]} />
            <SliderThumb />
            <Tooltip>{state.values[0]}</Tooltip>
          </TooltipTrigger>
        )}
      </SliderTrack>
      <AriaText slot='min'>{min || 0}</AriaText>
      <AriaText slot='max'>{max || 100}</AriaText>
    </Slider>
    {/* defaultValue: {value} */}
  </>
);

SliderExample.storyName = 'Slider';

SliderExample.argTypes = {
  ...args,
};

export const ControlledSliderExample: Story<SliderProps> = ({
  label,
  min,
  max,
  includeRangeLabel,
  includeTextField,
  value,
  ...rest
}) => (
  <Slider {...rest} value={value}>
    {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
    {includeTextField && (
      <SliderInput>
        <Input value={value} />
      </SliderInput>
    )}
    <SliderTrack>
      {({ state }) => (
        // {/* <TooltipTrigger> */}
        <>
          <SliderBar minValue={state.values[0]} />
          <SliderThumb />
        </>
        // {/* <Tooltip>{state.values[0]}</Tooltip> */}
        // {/* </TooltipTrigger> */}
        // {/* )} */}
      )}
    </SliderTrack>
    <AriaText slot='min'>{min || 0}</AriaText>
    <AriaText slot='max'>{max || 100}</AriaText>
  </Slider>
);

ControlledSliderExample.storyName = 'Controlled Slider';

ControlledSliderExample.argTypes = {
  ...args,
  value: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
};

export const RangeSliderExample: Story<SliderProps> = ({
  label,
  min,
  max,
  includeRangeLabel,
  includeTextField,
  value,
  ...rest
}) => (
  <Slider {...rest} value={value}>
    {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
    {includeTextField && (
      <SliderInput>
        <Input />
        <Input />
      </SliderInput>
    )}
    <SliderTrack>
      {({ state }) =>
        state.values.map((val: number, i: number) => (
          <>
            <SliderBar
              minValue={state.values[0]}
              maxValue={state.values[1]}
              key={`bar-${i}`}
            />
            <TooltipTrigger key={i}>
              <SliderThumb key={i} index={i} />
              <Tooltip>{val}</Tooltip>
            </TooltipTrigger>
          </>
        ))
      }
    </SliderTrack>
    <AriaText slot='min'>{min || 0}</AriaText>
    <AriaText slot='max'>{max || 100}</AriaText>
  </Slider>
);

RangeSliderExample.storyName = 'Range Slider';

RangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Range slider label',
  },
};

export const ControlledRangeSliderExample: Story<SliderProps> = ({
  label,
  min,
  max,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  ...rest
}) => (
  <Slider {...rest} value={[minValue, maxValue]} minValu={min} maxValue={max}>
    {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
    {includeTextField && (
      <SliderInput>
        <Input value={minValue} />
        <Input value={maxValue} />
      </SliderInput>
    )}
    <SliderTrack>
      {({ state }) =>
        state.values.map((_value: number, i: number) => (
          <>
            <SliderBar
              minValue={state.values[0]}
              maxValue={state.values[1]}
              key={`bar-${i}`}
            />
            <SliderThumb key={i} index={i} />
          </>
        ))
      }
    </SliderTrack>
    <AriaText slot='min'>{min || 0}</AriaText>
    <AriaText slot='max'>{max || 100}</AriaText>
  </Slider>
);

ControlledRangeSliderExample.storyName = 'Controlled range Slider';

ControlledRangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Controlled range slider label',
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
    defaultValue: 0,
  },
};

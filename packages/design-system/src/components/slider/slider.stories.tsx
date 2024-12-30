import { 
    type ArgTypes,
    type Story,
    type StoryDefault
} from "@ladle/react";
import {
  Slider,
  SliderInput,
  SliderThumb,
  SliderTrack,
  type SliderProps } from ".";
import { AriaLabel, AriaText } from "../aria";
import { Input } from "../input";


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
      type: 'boolean'
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
    defaultValue: 100
  }
};

export const SliderExample: Story<SliderProps> = ({ label, min, max, includeTextField, ...rest }) => (
  <Slider {...rest} defaultValue={50}>
    <AriaLabel>{label}</AriaLabel>
    {includeTextField && (
      <SliderInput>
        <Input />
      </SliderInput>
    )}
    <SliderTrack>
      <SliderThumb />
    </SliderTrack>
    <AriaText slot='min'>{min || 0}</AriaText>
    <AriaText slot='max'>{max || 100}</AriaText>
  </Slider>
)

SliderExample.storyName = 'Slider';

SliderExample.argTypes = {
  ...args,
};

export const RangeSliderExample: Story<SliderProps> = ({ label, min, max, includeTextField, ...rest }) => (
  <Slider {...rest} defaultValue={[25, 75]}>
    <AriaLabel>{label}</AriaLabel>
    {includeTextField && (
      <SliderInput>
        <Input />
        <Input />
      </SliderInput>
    )}
    <SliderTrack>
      {({ state }) => state.values.map((_value: number, i: number) => (
        <SliderThumb key={i} index={i} />
      ))}
    </SliderTrack>
    <AriaText slot='min'>{min || 0}</AriaText>
    <AriaText slot='max'>{max || 100}</AriaText>
  </Slider>
)

RangeSliderExample.storyName = 'Range Slider';

RangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Range slider label',
  }
};

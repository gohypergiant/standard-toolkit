import { 
    type ArgTypes,
    type Story,
    type StoryDefault
} from "@ladle/react";
import {
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps } from ".";
import { AriaLabel } from "../aria";


export default {
  title: 'Components / Slider',
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
    options: ['top', 'bottom'],
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
  }
};

export const SliderExample: Story<SliderProps> = ({ label, ...rest }) => (
  <Slider {...rest} defaultValue={50}>
    <AriaLabel>{label}</AriaLabel>
    <SliderOutput>
      {({ state }) => state.getThumbValueLabel(0)}
    </SliderOutput>
    {/* <SliderNumberField /> */}
    <SliderTrack>
      <SliderThumb />
    </SliderTrack>
  </Slider>
)

SliderExample.storyName = 'Slider';

SliderExample.argTypes = {
  ...args,
};

export const RangeSliderExample: Story<SliderProps> = ({ label, thumbLabels, ...rest }) => (
  <Slider {...rest} defaultValue={[25, 75]} thumbLabels={['Min', 'Max']}>
    <AriaLabel>{label}</AriaLabel>
    <SliderOutput>
    {({ state }) =>
          state.values.map((_value: number, i: number) => state.getThumbValueLabel(i)).join(' - ')}
    </SliderOutput>
    <SliderTrack>
      {({ state }) => state.values.map((_value: number, i: number) => (
        <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]} />
      ))}
    </SliderTrack>
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
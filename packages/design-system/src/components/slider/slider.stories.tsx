import { 
    type ArgTypes,
    type Story,
    type StoryDefault
} from "@ladle/react";
import { Slider, type SliderProps } from ".";
import { AriaLabel } from "../aria";
import { SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";
import { TextField } from "../text-field";


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
    <SliderOutput />
    <SliderTrack>
      <SliderThumb />
    </SliderTrack>
  </Slider>
)

SliderExample.storyName = 'Slider';

SliderExample.argTypes = {
  ...args,
};
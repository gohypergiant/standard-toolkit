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
import type { SliderRenderProps } from './types';
import { useState } from 'react';
import { sliderBar } from './slider.stories.css';

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

export const SliderExample: Story<SliderProps> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Slider {...rest}>
      {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
      {includeTextField && (
        <SliderInput>
          <Input value='' />
        </SliderInput>
      )}
      <SliderTrack>
        {({ state }: SliderRenderProps) => (
          <TooltipTrigger isOpen={open}>
            <div
              className={sliderBar}
              style={{
                position: 'absolute',
                left: state.getThumbValue(1) ? `${state.getThumbValue(0)}%` : 0,
                width: state.getThumbValue(1)
                  ? `${(state.getThumbValue(1) || 0) - (state.getThumbValue(0) || 0)}%`
                  : `${state.getThumbValue(0)}%`,
              }}
            />
            <SliderThumb onHoverChange={(isHovered) => setOpen(isHovered)} />
            <Tooltip>{state.values[0]}</Tooltip>
          </TooltipTrigger>
        )}
      </SliderTrack>
      <AriaText slot='min'>{minValue || 0}</AriaText>
      <AriaText slot='max'>{maxValue || 100}</AriaText>
    </Slider>
  );
};

SliderExample.storyName = 'Slider';

SliderExample.argTypes = {
  ...args,
};

export const ControlledSliderExample: Story<SliderProps> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  value,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Slider {...rest} value={value} minValue={minValue} maxValue={maxValue}>
      {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
      {includeTextField && (
        <SliderInput>
          <Input value={value} />
        </SliderInput>
      )}
      <SliderTrack>
        {({ state }: SliderRenderProps) => (
          <>
            <div
              className={sliderBar}
              style={{
                position: 'absolute',
                left: state.getThumbValue(1) ? `${state.getThumbValue(0)}%` : 0,
                width: state.getThumbValue(1)
                  ? `${(state.getThumbValue(1) || 0) - (state.getThumbValue(0) || 0)}%`
                  : `${state.getThumbValue(0)}%`,
              }}
            />
            <TooltipTrigger isOpen={open}>
              <SliderThumb onHoverChange={(isHovered) => setOpen(isHovered)} />
              <Tooltip>{state.values[0]}</Tooltip>
            </TooltipTrigger>
          </>
        )}
      </SliderTrack>
      <AriaText slot='min'>{minValue || 0}</AriaText>
      <AriaText slot='max'>{maxValue || 100}</AriaText>
    </Slider>
  );
};

ControlledSliderExample.storyName = 'Controlled Slider';

ControlledSliderExample.argTypes = {
  ...args,
  label: {
    control: {
      type: 'text',
    },
    defaultValue: 'Controlled slider label',
  },
  value: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
};

export const RangeSliderExample: Story<SliderProps> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  value,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Slider {...rest} defaultValue={[0, 0]} value={value}>
      {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
      {includeTextField && (
        <SliderInput>
          <Input />
          <Input />
        </SliderInput>
      )}
      <SliderTrack>
        {({ state }: SliderRenderProps) =>
          state.values.map((_value: number, i: number) => (
            <div key={i}>
              <div
                className={sliderBar}
                style={{
                  position: 'absolute',
                  left: state.getThumbValue(1)
                    ? `${state.getThumbValue(0)}%`
                    : 0,
                  width: state.getThumbValue(1)
                    ? `${(state.getThumbValue(1) || 0) - (state.getThumbValue(0) || 0)}%`
                    : `${state.getThumbValue(0)}%`,
                }}
              />
              <TooltipTrigger isOpen={open}>
                <SliderThumb
                  index={i}
                  onHoverChange={(isHovered) => setOpen(isHovered)}
                />
                <Tooltip>{state.values[i]}</Tooltip>
              </TooltipTrigger>
            </div>
          ))
        }
      </SliderTrack>
      <AriaText slot='min'>{minValue || 0}</AriaText>
      <AriaText slot='max'>{maxValue || 100}</AriaText>
    </Slider>
  );
};

RangeSliderExample.storyName = 'Range Slider';

RangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Range slider label',
  },
};

// added inputValues to make Ladle controls easier to use
export const ControlledRangeSliderExample: Story<
  SliderProps & {
    inputValueMin: number;
    inputValueMax: number;
  }
> = ({
  label,
  value,
  minValue,
  maxValue,
  inputValueMin,
  inputValueMax,
  includeRangeLabel,
  includeTextField,
  ...rest
}) => {
  const [open, setOpen] = useState<{ [index: number]: boolean }>({
    0: false,
    1: false,
  });

  return (
    <Slider
      {...rest}
      value={[inputValueMin, inputValueMax]}
      minValue={minValue}
      maxValue={maxValue}
    >
      {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
      {includeTextField && (
        <SliderInput>
          <Input value={inputValueMin} />
          <Input value={inputValueMax} />
        </SliderInput>
      )}
      <SliderTrack>
        {({ state }: SliderRenderProps) =>
          state.values.map((_value: number, i: number) => (
            <div key={i}>
              <div
                className={sliderBar}
                style={{
                  position: 'absolute',
                  left: state.getThumbValue(1)
                    ? `${state.getThumbValue(0)}%`
                    : 0,
                  width: state.getThumbValue(1)
                    ? `${(state.getThumbValue(1) || 0) - (state.getThumbValue(0) || 0)}%`
                    : `${state.getThumbValue(0)}%`,
                }}
              />
              <TooltipTrigger isOpen={open[i] ?? false}>
                <SliderThumb
                  key={i}
                  index={i}
                  onHoverChange={(isHovered) => setOpen({ [i]: isHovered })}
                />
                <Tooltip>{state.values[i]}</Tooltip>
              </TooltipTrigger>
            </div>
          ))
        }
      </SliderTrack>
      <AriaText slot='min'>{minValue || 0}</AriaText>
      <AriaText slot='max'>{maxValue || 100}</AriaText>
    </Slider>
  );
};

ControlledRangeSliderExample.storyName = 'Controlled range Slider';

ControlledRangeSliderExample.argTypes = {
  ...args,
  label: {
    ...args.label,
    defaultValue: 'Controlled range slider label',
  },
  inputValueMin: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
  inputValueMax: {
    control: {
      type: 'number',
    },
    defaultValue: 50,
  },
};

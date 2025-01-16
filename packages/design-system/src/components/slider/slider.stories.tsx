import type { ArgTypes, Story, StoryDefault } from '@ladle/react';
import { Slider, SliderBar, SliderThumb, SliderTrack, type SliderProps } from '.';
import { AriaLabel, AriaText } from '../aria';
import { Input } from '../input';
import { TooltipTrigger } from 'react-aria-components';
import { Tooltip } from '../tooltip';
import type { SliderRenderProps } from './types';
import { useState } from 'react';
import { Group } from '../group';
import { NumberField } from '../number-field';

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

const args: ArgTypes<
  SliderProps & {
    label: string;
    includeTextField: boolean;
    includeRangeLabel: boolean;
    includeOutputField: boolean;
  }
> = {
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
    options: ['stacked', 'inline'],
    defaultValue: 'stacked',
  },
  orientation: {
    control: {
      type: 'select',
    },
    options: ['horizontal', 'vertical'],
    defaultValue: 'horizontal'
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
  includeOutputField: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
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

export const SliderExample: Story<
  SliderProps & {
    label: string;
    includeTextField: boolean;
    includeRangeLabel: boolean;
    includeOutputField: boolean;
  }
> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  includeOutputField,
  // orientation,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Slider {...rest}>
      {({ state }) => (
        <>
          {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
          {includeOutputField && <AriaText>{state.values.join(',')}</AriaText>}
          {includeTextField && (
            <NumberField
              value={state.values[0]}
              onChange={(v) => state.setThumbValue(0, v)}
            >
              <Input />
            </NumberField>
          )}
          <SliderTrack>
            {({ state }: SliderRenderProps) => (
              <>
                <SliderBar />
                <TooltipTrigger isOpen={open}>
                  <SliderThumb
                    onHoverChange={(isHovered) => setOpen(isHovered)}
                  />
                  <Tooltip>{state.values[0]}</Tooltip>
                </TooltipTrigger>
              </>
            )}
          </SliderTrack>
          <AriaText slot='min'>{minValue || 0}</AriaText>
          <AriaText slot='max'>{maxValue || 100}</AriaText>
        </>
      )}
    </Slider>
  );
};

SliderExample.storyName = 'Slider with input';

SliderExample.argTypes = {
  ...args,
};

export const SliderExampleWithOutput: Story<
  SliderProps & {
    label: string;
    includeTextField: boolean;
    includeRangeLabel: boolean;
    includeOutputField: boolean;
  }
> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  includeOutputField,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Slider {...rest}>
      {({ state }) => (
        <>
          {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
          {includeOutputField && <AriaText>{state.values.join(',')}</AriaText>}
          <SliderTrack>
            {({ state }: SliderRenderProps) => (
              <>
                <SliderBar />
                <TooltipTrigger isOpen={open}>
                  <SliderThumb
                    onHoverChange={(isHovered) => setOpen(isHovered)}
                  />
                  <Tooltip>{state.values[0]}</Tooltip>
                </TooltipTrigger>
              </>
            )}
          </SliderTrack>
          <AriaText slot='min'>{minValue || 0}</AriaText>
          <AriaText slot='max'>{maxValue || 100}</AriaText>
        </>
      )}
    </Slider>
  );
};

SliderExampleWithOutput.storyName = 'Slider with output';

SliderExampleWithOutput.argTypes = {
  ...args,
  includeOutputField: {
    control: {
      type: 'boolean',
    },
    defaultValue: true,
  },
};

export const ControlledSliderExample: Story<
  SliderProps & {
    label: string;
    includeTextField: boolean;
    includeRangeLabel: boolean;
    includeOutputField: boolean;
  }
> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeTextField,
  includeOutputField,
  value,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Slider {...rest} value={value} minValue={minValue} maxValue={maxValue}>
      {({ state }) => (
        <>
          {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
          {includeOutputField && (
            <AriaText>{state.values.join(' - ')}</AriaText>
          )}
          {includeTextField && (
            <NumberField
              value={state.values[0]}
              onChange={(v) => state.setThumbValue(0, v)}
            >
              <Input />
            </NumberField>
          )}
          <SliderTrack>
            {({ state }: SliderRenderProps) => (
              <>
                <SliderBar />
                <TooltipTrigger isOpen={open}>
                  <SliderThumb
                    onHoverChange={(isHovered) => setOpen(isHovered)}
                  />
                  <Tooltip>{state.values[0]}</Tooltip>
                </TooltipTrigger>
              </>
            )}
          </SliderTrack>
          <AriaText slot='min'>{minValue || 0}</AriaText>
          <AriaText slot='max'>{maxValue || 100}</AriaText>
        </>
      )}
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

export const RangeSliderExample: Story<
  SliderProps & {
    label: string;
    includeTextField: boolean;
    includeRangeLabel: boolean;
    includeOutputField: boolean;
  }
> = ({
  label,
  minValue,
  maxValue,
  includeRangeLabel,
  includeOutputField,
  includeTextField,
  value,
  ...rest
}) => {
  const [open, setOpen] = useState<{ [index: number]: boolean }>({
    0: false,
    1: false,
  });

  return (
    <Slider {...rest} defaultValue={[25, 75]}>
      {({ state }) => {
        return (
          <>
            {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
            {includeOutputField && (
              <AriaText>{state.values.join(' - ')}</AriaText>
            )}
            {includeTextField && (
              <Group orientation='horizontal'>
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
              {({ state }: SliderRenderProps) =>
              <>
              <SliderBar />
                {state.values.map((_value: number, i: number) => (
                  <div key={i}>
                    <TooltipTrigger isOpen={open[i]} key={i}>
                      <SliderThumb
                        index={i}
                        key={i}
                        onHoverChange={(isHovered) =>
                          setOpen({ [i]: isHovered })
                        }
                        />
                      <Tooltip>{state.values[i]}</Tooltip>
                    </TooltipTrigger>
                  </div>
                ))}
              </>
              }
            </SliderTrack>
            <AriaText slot='min'>{minValue || 0}</AriaText>
            <AriaText slot='max'>{maxValue || 100}</AriaText>
          </>
        );
      }}
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
    label: string;
    inputValueMin: number;
    inputValueMax: number;
    includeTextField: boolean;
    includeRangeLabel: boolean;
    includeOutputField: boolean;
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
  includeOutputField,
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
      {({ state }) => (
        <>
          {includeRangeLabel && <AriaLabel>{label}</AriaLabel>}
          {includeOutputField && (
            <AriaText>{state.values.join(' - ')}</AriaText>
          )}
          {includeTextField && (
            <Group orientation='horizontal'>
              <NumberField
                value={state.values[0]}
                onChange={(v) => state.setThumbValue(0, v)}
              >
                <Input
                  onChange={(e) =>
                    state.setThumbValue(0, Number(e.target.value))
                  }
                />
              </NumberField>
              <NumberField
                value={state.values[1]}
                onChange={(v) => state.setThumbValue(1, v)}
              >
                <Input
                  onChange={(e) =>
                    state.setThumbValue(1, Number(e.target.value))
                  }
                />
              </NumberField>
            </Group>
          )}
          <SliderTrack>
            {({ state }: SliderRenderProps) => (
              <>
                <SliderBar />
                {state.values.map((_value: number, i: number) => (
                  <div key={i}>
                    <TooltipTrigger isOpen={open[i]}>
                      <SliderThumb
                        key={i}
                        index={i}
                        onHoverChange={(isHovered) =>
                          setOpen({ [i]: isHovered })
                        }
                      />
                      <Tooltip>{state.values[i]}</Tooltip>
                    </TooltipTrigger>
                  </div>
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
};

ControlledRangeSliderExample.storyName = 'Controlled range';

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

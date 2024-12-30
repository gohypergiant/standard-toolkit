import type { 
  NumberFieldProps as AriaNumberFieldProps,
  SliderRenderProps as RACSliderRenderProps, 
  SliderProps as RACSliderProps, 
  SliderThumbProps as RACSliderThumbProps,
  SliderThumbRenderProps as RACSliderThumbRenderProps,
  SliderTrackRenderProps as RACSliderTrackRenderProps,
  SliderTrackProps as RACSliderTrackProps,
  SliderOutputProps as RACSliderOutputProps,
} from "react-aria-components";
import type { RenderPropsChildren } from '../../types';
import type { PartialDeep } from 'type-fest';
import type { InputRenderProps } from "../input";

export type SliderClassNames = PartialDeep<{
  slider: {
    container: string;
    slider: string;
    label: string;
    track: string;
    thumb: string;
    min: string;
    max: string;
    input: string;
  },
  rangeSlider: {
    container: string;
    rangeSlider: string;
  }
}>;

export type LabelAlignment = 'top' | 'left';

export type SliderRenderProps = RACSliderRenderProps;
export type SliderThumbRenderProps = RACSliderThumbRenderProps;
export type SliderTrackRenderProps = RACSliderTrackRenderProps;
export type SliderInputRenderProps = RACSliderOutputProps;

type BaseSliderProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  label?: string;
  classNames?: SliderClassNames;
  alignLabel?: LabelAlignment;
  includeTextField?: boolean;
  includeRangeLabel?: boolean;
  min?: number;
  max?: number;
}

export type SliderState = RACSliderProps &
  Required<Pick<BaseSliderProps, 'alignLabel'>>;

// should state be omitted? it seems needed for styling purposes?
// Omit<RACSliderProps, 'state'> &
// Required<Pick<BaseSliderProps, 'alignLabel'>>;


export type SliderProps = Omit<
  RACSliderProps,
  'children' | 'classname' | 'style'
> & 
  BaseSliderProps;

type BaseSliderThumbProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
}

export type SliderThumbProps = Omit<RACSliderThumbProps, 'className' | 'style'> & BaseSliderThumbProps;

type BaseSliderTrackProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
}

export type SliderTrackProps = Omit<RACSliderTrackProps, 'className' | 'style'> & BaseSliderTrackProps;

// attempt to use input instead of text display
type BaseSliderInputProps = {
  children?: RenderPropsChildren<InputRenderProps>;
  classNames?: SliderClassNames;
}

export type SliderInputProps = Omit<AriaNumberFieldProps, 'className' | 'style'> & BaseSliderInputProps;
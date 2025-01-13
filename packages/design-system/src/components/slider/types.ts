import type {
  NumberFieldProps as AriaNumberFieldProps,
  SliderRenderProps as RACSliderRenderProps,
  SliderProps as RACSliderProps,
  SliderThumbProps as RACSliderThumbProps,
  SliderThumbRenderProps as RACSliderThumbRenderProps,
  SliderTrackRenderProps as RACSliderTrackRenderProps,
  SliderTrackProps as RACSliderTrackProps,
  SliderOutputProps as RACSliderOutputProps,
} from 'react-aria-components';
import type { RenderPropsChildren } from '../../types';
import type { PartialDeep } from 'type-fest';
import type { InputClassNames, InputRenderProps } from '../input';
import type { GroupClassNames } from '../group';

export type SliderClassNames = PartialDeep<{
  slider: {
    container: string;
    label: string;
    min: string;
    max: string;
  };
  track: {
    container: string;
    track: string; // TODO: adjust the styles to use this class
  };
  thumb: {
    container: string;
    thumb: string;
  };
  input: InputClassNames;
  output: {
    container: string;
  };
  group: GroupClassNames;
}>;

export type LabelAlignment = 'top' | 'left';

export type SliderRenderProps = RACSliderRenderProps;
export type SliderThumbRenderProps = RACSliderThumbRenderProps;
export type SliderTrackRenderProps = RACSliderTrackRenderProps;

type BaseSliderProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  label?: string;
  classNames?: SliderClassNames;
  alignLabel?: LabelAlignment;
  includeTextField?: boolean;
  includeRangeLabel?: boolean;
  includeOutputField?: boolean;
  minValue?: number;
  maxValue?: number;
};

export type SliderState = Omit<RACSliderRenderProps, 'state'> &
  Required<Pick<BaseSliderProps, 'alignLabel'>>;

export type SliderProps = Omit<
  RACSliderProps,
  'children' | 'classname' | 'style'
> &
  BaseSliderProps;

type BaseSliderThumbProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
};

export type SliderThumbProps = Omit<
  RACSliderThumbProps,
  'className' | 'style'
> &
  BaseSliderThumbProps;

export type SliderThumbState = Omit<RACSliderThumbRenderProps, 'state'>;

type BaseSliderTrackProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
};

export type SliderTrackProps = Omit<
  RACSliderTrackProps,
  'className' | 'style'
> &
  BaseSliderTrackProps;

type BaseSliderInputProps = {
  children?: RenderPropsChildren<InputRenderProps>;
  classNames?: SliderClassNames;
};

export type SliderInputProps = Omit<
  AriaNumberFieldProps,
  'className' | 'style'
> &
  BaseSliderInputProps;

type BaseSliderOutputProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
};

export type SliderOutputProps = Omit<
  RACSliderOutputProps,
  'className' | 'style'
> &
  BaseSliderOutputProps;

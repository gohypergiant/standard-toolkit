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
import type { InputClassNames } from '../input';
import type { GroupClassNames } from '../group';

export type SliderClassNames = PartialDeep<{
  slider: {
    container: string;
    slider: string;
    label: string;
    min: string;
    max: string;
  };
  track: {
    container: string;
    track: string;
  };
  bar: {
    container: string;
    bar: string;
  };
  thumb: {
    container: string;
    thumb: string;
  };
  input: InputClassNames;
  output: {
    container: string;
    output: string;
  };
  group: GroupClassNames;
}>;

export type SliderLabelAlignment = 'stacked' | 'inline';

export type SliderRenderProps = RACSliderRenderProps;
export type SliderThumbRenderProps = RACSliderThumbRenderProps;
export type SliderTrackRenderProps = RACSliderTrackRenderProps;

type BaseSliderProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
  alignLabel?: SliderLabelAlignment;
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

export type SliderThumbProps = Omit<
  RACSliderThumbProps,
  'className' | 'style'
> &
  {
    classNames?: SliderClassNames;
  };

export type SliderThumbState = Omit<RACSliderThumbRenderProps, 'state'>;

export type SliderTrackProps = Omit<
  RACSliderTrackProps,
  'className' | 'style'
> &
  {
    classNames?: SliderClassNames;
  };

export type SliderInputProps = Omit<
  AriaNumberFieldProps,
  'className' | 'style'
> &
  {
    classNames?: SliderClassNames;
  };

export type SliderOutputProps = Omit<
  RACSliderOutputProps,
  'className' | 'style'
> &
  {
    classNames?: SliderClassNames;
  };

export type SliderBarProps = {
  classNames?: SliderClassNames;
};

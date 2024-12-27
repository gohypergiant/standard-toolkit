import type { 
  SliderRenderProps as RACSliderRenderProps, 
  SliderProps as RACSliderProps, 
  SliderThumbProps as RACSliderThumbProps,
  SliderThumbRenderProps as RACSliderThumbRenderProps,
  SliderTrackRenderProps as RACSliderTrackRenderProps,
  SliderTrackProps as RACSliderTrackProps
} from "react-aria-components";
import type { RenderPropsChildren } from '../../types';
import type { PartialDeep } from 'type-fest';

export type SliderClassNames = PartialDeep<{
  slider: {
    container: string;
    slider: string;
    label: string;
    track: string;
    thumb: string;
    output: string;
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

type BaseSliderProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  label?: string;
  classNames?: SliderClassNames;
  alignLabel?: LabelAlignment;
  includeTextField?: boolean;
  includeRangeLabel?: boolean;
  thumbLabels?: string[];
}

export type SliderState = Omit<RACSliderProps, 'state'> &
  Required<Pick<BaseSliderProps, 'alignLabel'>>;

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

export type SliderTrackProps = Omit<RACSliderThumbProps, 'className' | 'style'> & BaseSliderTrackProps;

type BaseSliderOutputProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
}

export type SliderOutputProps = Omit<RACSliderThumbProps, 'className' | 'style'> & BaseSliderOutputProps;
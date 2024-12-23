import type { SliderRenderProps as RACSliderRenderProps, SliderProps as RACSliderProps } from "react-aria-components";
import type { RenderPropsChildren } from '../../types';
import type { PartialDeep } from 'type-fest';

export type SliderClassNames = PartialDeep<{
  slider: {
    container: string;
    slider: string;
    label: string;
  },
  rangeSlider: {
    container: string;
    rangeSlider: string;
  }
}>;

export type LabelAlignment = 'top' | 'left';

export type SliderRenderProps = RACSliderRenderProps;

type BaseSliderProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  label?: string;
  classNames?: SliderClassNames;
  alignLabel?: LabelAlignment;
  includeTextField?: boolean;
  includeRangeLabel?: boolean;
}

export type SliderState = Omit<RACSliderProps, 'state'> &
  Required<Pick<BaseSliderProps, 'alignLabel'>>;

export type SliderProps = Omit<
  RACSliderProps,
  'children' | 'classname' | 'style'
> & 
  BaseSliderProps;


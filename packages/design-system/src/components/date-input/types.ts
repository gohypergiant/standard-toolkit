import type { ReactElement } from 'react';
import type {
  DateInputProps as RACDateInputProps,
  DateInputRenderProps as RACDateInputRenderProps,
  DateSegmentProps as RACDateSegmentProps,
  DateSegmentRenderProps as RACDateSegmentRenderProps,
} from 'react-aria-components';
import type { DateSegment as TDateSegment } from 'react-stately';
import type { PartialDeep } from 'type-fest';
import type { AsType, RenderPropsChildren } from '../../types';

type BaseDateInputProps = {
  classNames?: DateInputClassNames;
};

export type DateInputClassNames = PartialDeep<{
  dateInput: {
    container: string;
    dateInput: string;
  };
  segments: {
    container: string;
    segments: string;
  };
  segment: {
    container: string;
    segment: string;
  };
}>;

export type DateInputProps = Omit<
  RACDateInputProps,
  'className' | 'style' | 'children'
> &
  BaseDateInputProps & {
    provider?: boolean;
  } & (
    | { provider?: false; children: (segment: TDateSegment) => ReactElement }
    | { provider: true; children: RenderPropsChildren<DateInputRenderProps> }
  );

export type DateInputRenderProps = AsType<RACDateInputRenderProps>;

export type DateSegmentsProps = {
  children: any;
} & BaseDateInputProps;

export type DateSegmentProps = AsType<RACDateSegmentProps> & BaseDateInputProps;

export type DateSegmentRenderProps = RACDateSegmentRenderProps;

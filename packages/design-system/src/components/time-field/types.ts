import type {
  TimeFieldProps as RACTimeFieldProps,
  DateFieldRenderProps as RACTimeFieldRenderProps,
  TimeValue,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types';
import type { DateFieldSizes } from '../date-field/types';
import type { DateInputClassNames } from '../date-input/types';

export type TimeFieldClassNames = PartialDeep<{
  container: string;
  dateInput: DateInputClassNames;
  description: string;
  error: string;
  label: string;
  timeField: string;
}>;

export type TimeFieldSizes = 'sm' | 'lg';

export type TimeFieldMapping = {
  description: Partial<Record<TimeFieldSizes, string>>;
  error: Partial<Record<DateFieldSizes, string>>;
};

type BaseTimeFieldProps = {
  classNames?: TimeFieldClassNames;
  mapping?: Partial<TimeFieldMapping>;
  size?: TimeFieldSizes;
};

export type TimeFieldRenderProps = AsType<RACTimeFieldRenderProps>;

export type TimeFieldProps<T extends TimeValue> = Omit<
  RACTimeFieldProps<T>,
  'className' | 'style'
> &
  BaseTimeFieldProps;

export type TimeFieldState = Omit<TimeFieldRenderProps, 'state'> &
  Required<Pick<BaseTimeFieldProps, 'size'>>;

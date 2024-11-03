import type {
  DateValue,
  DateFieldProps as RACDateFieldProps,
  DateFieldRenderProps as RACDateFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types';
import type { DateInputClassNames } from '../date-input/types';

export type DateFieldClassNames = PartialDeep<{
  container: string;
  dateField: string;
  dateInput: DateInputClassNames;
  description: string;
  error: string;
  label: string;
}>;

export type DateFieldSizes = 'sm' | 'lg';

export type DateFieldMapping = {
  description: Partial<Record<DateFieldSizes, string>>;
  error: Partial<Record<DateFieldSizes, string>>;
};

type BaseDateFieldProps = {
  classNames?: DateFieldClassNames;
  mapping?: Partial<DateFieldMapping>;
  size?: DateFieldSizes;
};

export type DateFieldRenderProps = AsType<RACDateFieldRenderProps>;

export type DateFieldProps<T extends DateValue> = Omit<
  RACDateFieldProps<T>,
  'className' | 'style'
> &
  BaseDateFieldProps;

export type DateFieldState = Omit<DateFieldRenderProps, 'state'> &
  Required<Pick<BaseDateFieldProps, 'size'>>;

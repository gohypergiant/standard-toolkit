import type {
  NumberFieldProps as AriaNumberFieldProps,
  NumberFieldRenderProps as RACNumberFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type {
  ButtonClassNames,
  ButtonProps,
  InputClassNames,
} from '../../components';
import type {
  AsType,
  OmitProtectedProps,
  RenderPropsChildren,
} from '../../types';

export type NumberFieldClassNames = PartialDeep<{
  container: string;
  decrement: ButtonClassNames;
  description: string;
  error: string;
  group: string;
  increment: ButtonClassNames;
  input: InputClassNames;
  label: string;
  numberField: string;
}>;

export type NumberFieldSizes = 'sm' | 'lg';

export type NumberFieldMapping = {
  description: Partial<Record<NumberFieldSizes, string>>;
  error: Partial<Record<NumberFieldSizes, string>>;
  increment: Partial<Record<NumberFieldSizes, OmitProtectedProps<ButtonProps>>>;
  decrement: Partial<Record<NumberFieldSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseNumberFieldProps = {
  children?: RenderPropsChildren<NumberFieldRenderProps>;
  classNames?: NumberFieldClassNames;
  mapping?: Partial<NumberFieldMapping>;
  size?: NumberFieldSizes;
};

export type NumberFieldRenderProps = AsType<RACNumberFieldRenderProps>;

export type NumberFieldProps = AsType<
  Omit<AriaNumberFieldProps, 'className' | 'style'>
> &
  BaseNumberFieldProps;

export type NumberFieldState = NumberFieldRenderProps &
  Required<Pick<BaseNumberFieldProps, 'size'>>;

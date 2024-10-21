import type {
  TextFieldProps as AriaTextFieldProps,
  TextFieldRenderProps as RACTextFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { InputClassNames } from '../../components';
import type { AsType, RenderPropsChildren } from '../../types';

export type TextFieldClassNames = PartialDeep<{
  container: string;
  description: string;
  error: string;
  input: InputClassNames;
  label: string;
  textField: string;
}>;

export type TextFieldSizes = 'sm' | 'lg';

export type TextFieldMapping = {
  description: Partial<Record<TextFieldSizes, string>>;
  error: Partial<Record<TextFieldSizes, string>>;
};

type BaseTextFieldProps = {
  children?: RenderPropsChildren<TextFieldRenderProps>;
  classNames?: TextFieldClassNames;
  mapping?: Partial<TextFieldMapping>;
  size?: TextFieldSizes;
};

export type TextFieldRenderProps = AsType<RACTextFieldRenderProps>;

export type TextFieldProps = AsType<
  Omit<AriaTextFieldProps, 'className' | 'style'>
> &
  BaseTextFieldProps;

export type TextFieldState = TextFieldRenderProps &
  Required<Pick<BaseTextFieldProps, 'size'>>;

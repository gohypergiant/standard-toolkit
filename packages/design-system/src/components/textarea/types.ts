import type { AsType } from '../../types';
import type { FormEventHandler } from 'react';
import type {
  InputRenderProps as RACInputRenderProps,
  TextAreaProps as RACTextAreaProps,
} from 'react-aria-components';

export type TextAreaClassNames = Partial<{
  container: string;
  textarea: string;
}>;

export type TextAreaSize = 'sm' | 'lg';

export type TextAreaMapping = {
  font: Partial<Record<TextAreaSize, string>>;
};

export type TextAreaRenderProps = AsType<RACInputRenderProps> & {
  /**
   * If value is undefined or empty
   */
  isEmpty: boolean;
  /**
   * If placeholder is provided and value is undefined or empty
   */
  isPlaceholder: boolean;
  /**
   * If read only
   */
  isReadOnly: boolean;
  /**
   * If required
   */
  isRequired: boolean;
};

export type TextAreaResize = 'both' | 'horizontal' | 'vertical' | 'none';

export type BaseTextAreaProps = {
  classNames?: TextAreaClassNames;
  mapping?: Partial<TextAreaMapping>;
  resize?: TextAreaResize;
  size?: TextAreaSize;
  onChange?: FormEventHandler<HTMLSpanElement>;
};

export type TextAreaState = TextAreaRenderProps &
  Required<Pick<BaseTextAreaProps, 'resize' | 'size'>>;

export type TextAreaProps = Omit<
  RACTextAreaProps,
  'children' | 'className' | 'cols' | 'rows' | 'style' | 'onChange'
> &
  BaseTextAreaProps;

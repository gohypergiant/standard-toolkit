import type { AsType } from '../../types';
import type {
  InputRenderProps as RACInputRenderProps,
  InputProps as RACInputProps,
} from 'react-aria-components';

export type InputClassNames = Partial<{
  container: string;
  sizer: string;
  input: string;
}>;

export type InputRenderProps = AsType<RACInputRenderProps> & {
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

export type InputSize = 'sm' | 'lg';

export type InputMapping = {
  sizer: Partial<Record<InputSize, string>>;
  input: Partial<Record<InputSize, string>>;
};

// Limit to types that fit the "text" style
export type InputType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url';

export type BaseInputProps = {
  classNames?: InputClassNames;
  mapping?: Partial<InputMapping>;
  size?: InputSize;
  type?: InputType;
};

export type InputState = InputRenderProps &
  Required<Pick<BaseInputProps, 'size' | 'type'>> & {
    /**
     * The length of the input value or placeholder (whichever is currently rendered)
     */
    length: string;
  };

export type InputProps = Omit<
  RACInputProps,
  'children' | 'className' | 'size' | 'style' | 'type'
> &
  BaseInputProps;

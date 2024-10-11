import { type AsType } from '@cbc2/types';
import {
  type ComboBoxProps as RACComboBoxProps,
  type ComboBoxRenderProps as RACComboBoxRenderProps,
} from 'react-aria-components';
import { type PartialDeep } from 'type-fest';
import { type OmitProtectedProps } from '../../types';
import { type ButtonClassNames, type ButtonProps } from '../button/types';
import { type InputClassNames } from '../input/types';
import { type OptionsClassNames } from '../options/types';

export type ComboBoxClassNames = PartialDeep<{
  container: string;
  comboBox: string;
  label: string;
  group: string;
  input: InputClassNames;
  toggle: ButtonClassNames;
  description: string;
  error: string;
  options: OptionsClassNames;
}>;

export type ComboBoxSizes = 'sm' | 'lg';

export type ComboBoxMapping = {
  description: Partial<Record<ComboBoxSizes, string>>;
  error: Partial<Record<ComboBoxSizes, string>>;
  toggle: Partial<Record<ComboBoxSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseComboBoxProps = {
  classNames?: ComboBoxClassNames;
  mapping?: Partial<ComboBoxMapping>;
  size?: ComboBoxSizes;
};

export type ComboBoxRenderProps = AsType<RACComboBoxRenderProps>;

export type ComboBoxState = ComboBoxRenderProps &
  Required<Pick<BaseComboBoxProps, 'size'>>;

export type ComboBoxProps<T extends object> = Omit<
  RACComboBoxProps<T>,
  'className' | 'style'
> &
  BaseComboBoxProps;

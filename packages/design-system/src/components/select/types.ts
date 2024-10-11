import { type AsType } from '@cbc2/types';
import {
  type SelectProps as RACSelectProps,
  type SelectRenderProps as RACSelectRenderProps,
} from 'react-aria-components';
import { type PartialDeep } from 'type-fest';
import { type OmitProtectedProps } from '../../types';
import { type ButtonClassNames, type ButtonProps } from '../button/types';
import { type OptionsClassNames } from '../options/types';

export type SelectClassNames = PartialDeep<{
  container: string;
  select: string;
  label: string;
  toggle: ButtonClassNames;
  value: string;
  description: string;
  error: string;
  options: OptionsClassNames;
}>;

export type SelectSizes = 'sm' | 'lg';

export type SelectMapping = {
  description: Partial<Record<SelectSizes, string>>;
  error: Partial<Record<SelectSizes, string>>;
  toggle: Partial<Record<SelectSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseSelectProps = {
  classNames?: SelectClassNames;
  mapping?: Partial<SelectMapping>;
  size?: SelectSizes;
};

export type SelectRenderProps = AsType<RACSelectRenderProps>;

export type SelectState = SelectRenderProps &
  Required<Pick<BaseSelectProps, 'size'>>;

export type SelectProps<T extends object> = Omit<
  RACSelectProps<T>,
  'className' | 'style'
> &
  BaseSelectProps;

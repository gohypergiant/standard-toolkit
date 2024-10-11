import type {
  SearchFieldProps as RACSearchFieldProps,
  SearchFieldRenderProps as RACSearchFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType, OmitProtectedProps } from '../../types';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type { IconClassNames, IconProps } from '../icon/types';
import type { InputClassNames, InputSize } from '../input/types';

export type SearchFieldClassNames = PartialDeep<{
  container: string;
  group: string;
  icon: IconClassNames;
  input: InputClassNames;
  clear: ButtonClassNames;
}>;

export type SearchFieldSizes = 'sm' | 'lg';

export type SearchFieldVariants = 'solid' | 'hollow';

export type SearchFieldMapping = {
  icon: Partial<Record<SearchFieldSizes, OmitProtectedProps<IconProps>>>;
  clear: Partial<Record<SearchFieldSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseSearchFieldProps = {
  classNames?: SearchFieldClassNames;
  mapping?: Partial<SearchFieldMapping>;
  size?: InputSize;
  variant?: SearchFieldVariants;
};

export type SearchFieldRenderProps = AsType<RACSearchFieldRenderProps>;

export type SearchFieldState = Omit<SearchFieldRenderProps, 'state'> &
  Required<Pick<BaseSearchFieldProps, 'variant' | 'size'>>;

export type SearchFieldProps = Omit<
  RACSearchFieldProps,
  'className' | 'style' | 'type'
> &
  BaseSearchFieldProps;

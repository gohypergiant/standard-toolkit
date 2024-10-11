import type { PropsWithChildren } from 'react';
import type {
  TagGroupProps,
  TagListProps,
  TagProps,
  TagRenderProps,
} from 'react-aria-components';
import type {
  AsType,
  OmitProtectedProps,
  RenderPropsChildren,
} from '../../types';
import type { ButtonProps } from '../button/types';

export type ChipClassNames = Partial<{
  group: string;
  list: string;
  container: string;
  chip: string;
  label: string;
  remove: string;
}>;

export type ChipColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'advisory'
  | 'affirmative'
  | 'serious'
  | 'critical';

export type ChipSizes = 'sm' | 'lg';

export type ChipRenderProps = AsType<TagRenderProps>;

export type ChipMapping = {
  font: Partial<Record<ChipSizes, string>>;
  remove: Partial<Record<ChipSizes, OmitProtectedProps<ButtonProps>>>;
};

export type BaseChipProps = {
  children?: RenderPropsChildren<ChipRenderProps>;
  classNames?: ChipClassNames;
  color?: ChipColors;
  mapping?: Partial<ChipMapping>;
  size?: ChipSizes;
};

export type ChipState = ChipRenderProps &
  Required<Pick<BaseChipProps, 'color' | 'size'>>;

export type ChipProps = PropsWithChildren<Omit<BaseChipProps, 'children'>>;

export type ChipItemProps = Omit<TagProps, 'children' | 'className' | 'style'> &
  BaseChipProps;

export type ChipListProps<T> = Omit<TagListProps<T>, 'className' | 'style'> &
  Pick<BaseChipProps, 'classNames'>;

export type ChipGroupProps = Omit<TagGroupProps, 'className' | 'style'> &
  Omit<BaseChipProps, 'children'>;

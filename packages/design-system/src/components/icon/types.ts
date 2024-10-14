import type { CSSProperties, PropsWithChildren } from 'react';
import type { SlotProps } from 'react-aria-components';

export type IconClassNames = Partial<{
  container: string;
  icon: string;
}>;

export type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'relative';

export type BaseIconProps = Pick<CSSProperties, 'color' | 'fill' | 'stroke'> & {
  classNames?: IconClassNames;
  size?: IconSizes;
};

export type IconState = Required<Omit<BaseIconProps, 'classNames'>>;

export type IconProps = PropsWithChildren<BaseIconProps & SlotProps>;

import type {
  LinkProps,
  LinkRenderProps,
  ButtonProps as RACButtonProps,
  ButtonRenderProps as RACButtonRenderProps,
  ToggleButtonProps as RACToggleButtonProps,
  ToggleButtonRenderProps,
} from 'react-aria-components';
import type { OmitProtectedProps, RenderPropsChildren } from '../../types';
import type { IconProps } from '../icon/types';

export type ButtonClassNames = Partial<{
  container: string;
  button: string;
}>;

export type ButtonColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'advisory'
  | 'affirmative'
  | 'serious'
  | 'critical';

export type ButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariants = 'solid' | 'hollow' | 'bare' | 'icon' | 'floating';

export type ButtonRenderProps = RACButtonRenderProps &
  LinkRenderProps &
  ToggleButtonRenderProps;

export type ButtonMapping = {
  font: Partial<Record<ButtonSizes, string>>;
  icon: Partial<Record<ButtonSizes, OmitProtectedProps<IconProps>>>;
};

type BaseButtonProps = {
  children?: RenderPropsChildren<ButtonRenderProps>;
  classNames?: ButtonClassNames;
  color?: ButtonColors;
  mapping?: Partial<ButtonMapping>;
  size?: ButtonSizes;
  variant?: ButtonVariants;
};

export type ButtonState = Omit<ButtonRenderProps, 'state'> &
  Required<Pick<BaseButtonProps, 'color' | 'size' | 'variant'>>;

export type ButtonProps = Omit<
  RACButtonProps,
  'children' | 'className' | 'style'
> &
  BaseButtonProps;

export type ToggleButtonProps = Omit<
  RACToggleButtonProps,
  'children' | 'className' | 'style'
> &
  BaseButtonProps;

export type LinkButtonProps = Omit<
  LinkProps,
  'children' | 'className' | 'style'
> &
  BaseButtonProps;

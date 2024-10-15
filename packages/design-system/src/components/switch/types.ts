import type {
  SwitchProps as RACSwitchProps,
  SwitchRenderProps as RACSwitchRenderProps,
} from 'react-aria-components';
import type { RenderPropsChildren } from '../../types';

export type SwitchClassNames = Partial<{
  container: string;
  switch: string;
  label: string;
  indicator: string;
}>;

export type SwitchAlignment = 'start' | 'end';

export type SwitchRenderProps = RACSwitchRenderProps;

export type BaseSwitchProps = {
  children?: RenderPropsChildren<SwitchRenderProps>;
  classNames?: SwitchClassNames;
  alignInput?: SwitchAlignment;
};

export type SwitchState = Omit<SwitchRenderProps, 'state'> &
  Required<Pick<BaseSwitchProps, 'alignInput'>>;

export type SwitchProps = Omit<
  RACSwitchProps,
  'children' | 'className' | 'style'
> &
  BaseSwitchProps;

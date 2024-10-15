import type { PropsWithChildren } from 'react';
import type {
  TooltipProps as RACTooltipProps,
  TooltipRenderProps as RACTooltipRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { RenderPropsChildren } from '../../types';

export type TooltipClassNames = PartialDeep<{
  tooltip: {
    container: string;
    tooltip: string;
  };
  target: {
    container: string;
    target: string;
  };
}>;

export type TooltipMapping = {
  font: string;
};

export type TooltipRenderProps = RACTooltipRenderProps & {
  /**
   * If the tooltip is visible
   */
  isOpen: boolean;
};

type BaseProps = {
  classNames?: TooltipClassNames;
  mapping?: Partial<TooltipMapping>;
};

type BaseTooltipProps = BaseProps & {
  children?: RenderPropsChildren<TooltipRenderProps>;
};

type BaseTooltipTargetProps = BaseProps & {
  focusable?: boolean;
  relative?: 'parent' | 'self';
};

export type TooltipState = Omit<TooltipRenderProps, 'state'> &
  Required<
    Pick<RACTooltipProps, 'containerPadding' | 'crossOffset' | 'offset'>
  >;

export type TooltipTargetState = Required<
  Pick<BaseTooltipTargetProps, 'focusable' | 'relative'>
>;

export type TooltipProps = Omit<
  RACTooltipProps,
  'className' | 'style' | 'UNSTABLE_portalContainer'
> &
  BaseTooltipProps;

export type TooltipTargetProps = PropsWithChildren<BaseTooltipTargetProps>;

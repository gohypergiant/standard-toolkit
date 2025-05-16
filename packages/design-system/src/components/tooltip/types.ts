/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { PropsWithChildren } from 'react';
import type {
  TooltipProps as RACTooltipProps,
  TooltipRenderProps as RACTooltipRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { RenderPropsChildren } from '../../types/react-aria';

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
  'children' | 'className' | 'style' | 'UNSTABLE_portalContainer'
> &
  BaseTooltipProps;

export type TooltipTargetProps = PropsWithChildren<BaseTooltipTargetProps>;

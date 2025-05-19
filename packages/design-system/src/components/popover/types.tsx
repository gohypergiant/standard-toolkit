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

import type { OverlayTriggerState } from '@react-stately/overlays';
import type {
  PopoverProps as RACPopoverProps,
  PopoverRenderProps as RACPopoverRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { OmitProtectedProps } from '../../types/props';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { ButtonProps } from '../button/types';
import type { GroupProps } from '../group/types';

export type PopoverClassNames = PartialDeep<{
  popover: {
    container: string;
    popover: string;
  };
  header: string;
  content: string;
  footer: string;
}>;

export type PopoverMapping = {
  heading: string;
  actions: GroupProps<ButtonProps, HTMLButtonElement>;
  primary: Partial<OmitProtectedProps<ButtonProps>>;
  secondary: Partial<OmitProtectedProps<ButtonProps>>;
};

export type PopoverRenderProps = AsType<RACPopoverRenderProps> &
  Pick<OverlayTriggerState, 'close'>;

type BasePopoverProps = {
  children?: RenderPropsChildren<PopoverRenderProps>;
  classNames?: PopoverClassNames;
  mapping?: Partial<PopoverMapping>;
};

export type PopoverProps = Omit<
  RACPopoverProps,
  'children' | 'className' | 'style'
> &
  BasePopoverProps;

export type PopoverState = Omit<PopoverRenderProps, 'trigger' | 'close'> & {
  hasHeader: boolean;
};

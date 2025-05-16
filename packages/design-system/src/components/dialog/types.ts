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

import type { RefObject } from 'react';
import type {
  HeadingProps,
  ModalOverlayProps,
  ModalRenderProps,
  DialogProps as RACDialogProps,
} from 'react-aria-components';
import type { OmitProtectedProps } from '../../types/props';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { ButtonProps } from '../button/types';
import type { GroupProps } from '../group/types';

export type DialogClassNames = Partial<{
  portal: string;
  container: string;
  modal: string;
  dialog: string;
  header: string;
  content: string;
  footer: string;
}>;

export type DialogSizes = 'sm' | 'lg';

export type DialogMapping = {
  heading: Partial<Record<DialogSizes, HeadingProps>>;
  actions: GroupProps<ButtonProps, HTMLButtonElement>;
  primary: Partial<Record<DialogSizes, OmitProtectedProps<ButtonProps>>>;
  secondary: Partial<Record<DialogSizes, OmitProtectedProps<ButtonProps>>>;
};

export type DialogRenderProps = ModalRenderProps & {
  /**
   * If the dialog is relative to the viewport (vs a specified parent element)
   */
  isGlobal: boolean;
  /**
   * If the dialog is visible
   */
  isOpen: boolean;
};

type BaseDialogProps = Pick<RACDialogProps, 'role'> & {
  children?: RenderPropsChildren<DialogRenderProps>;
  classNames?: DialogClassNames;
  mapping?: Partial<DialogMapping>;
  /**
   * Optionally provide a ref to a parent container that the dialog will be portaled into
   * This will make it so the Dialog is not global in the DOM and will visually center it
   * to the parent's area instead of the whole viewport
   */
  parentRef?: RefObject<HTMLElement>;
  size?: DialogSizes;
};

export type DialogState = Omit<DialogRenderProps, 'state'> &
  Required<Pick<BaseDialogProps, 'size'>> & {
    hasHeader: boolean;
  };

export type DialogProps = Omit<
  ModalOverlayProps,
  'children' | 'className' | 'style'
> &
  BaseDialogProps;

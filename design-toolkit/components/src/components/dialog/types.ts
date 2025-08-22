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

import type { ReactNode, Ref, RefObject } from 'react';
import type {
  DialogTriggerProps as AriaDialogTriggerProps,
  DialogRenderProps,
  ModalOverlayProps,
} from 'react-aria-components';

export type DialogSize = 'small' | 'large';

export interface DialogTriggerProps extends AriaDialogTriggerProps {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  parentRef?: RefObject<HTMLElement | null>;
  size?: DialogSize;
}

export type DialogProps = Omit<ModalOverlayProps, 'children'> & {
  children: ReactNode | ReactNode[] | ((opts: DialogRenderProps) => ReactNode);
  classNames?: {
    modal?: string;
    dialog?: string;
  };
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  ref?: Ref<HTMLDivElement>;
};

export type DialogContextValue = Pick<
  DialogTriggerProps,
  'size' | 'parentRef' | 'isKeyboardDismissDisabled' | 'isOpen'
> &
  Pick<DialogProps, 'onOpenChange'>;

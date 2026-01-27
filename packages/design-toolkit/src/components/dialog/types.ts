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

import type { RefAttributes, RefObject } from 'react';
import type {
  DialogProps as AriaDialogProps,
  DialogTriggerProps as AriaDialogTriggerProps,
  ModalOverlayProps,
} from 'react-aria-components';

/**
 * Props for the Dialog component.
 */
export type DialogProps = Omit<ModalOverlayProps, 'children' | 'className'> &
  Pick<AriaDialogProps, 'children'> &
  RefAttributes<HTMLDivElement> & {
    /** Custom class names for sub-elements. */
    classNames?: {
      /** Class name for the overlay backdrop. */
      overlay?: ModalOverlayProps['className'];
      /** Class name for the modal container. */
      modal?: ModalOverlayProps['className'];
      /** Class name for the dialog element. */
      dialog?: AriaDialogProps['className'];
    };
    /** Reference to parent element for portal rendering. */
    parentRef?: RefObject<HTMLElement | null>;
    /** Size variant of the dialog. */
    size?: 'small' | 'large';
  };

/**
 * Props for the DialogTrigger component.
 */
export type DialogTriggerProps = AriaDialogTriggerProps;

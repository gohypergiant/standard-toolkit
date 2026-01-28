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

import type { ComponentPropsWithRef } from 'react';
import type {
  PopoverProps as AriaPopoverProps,
  DialogProps,
  DialogTriggerProps,
} from 'react-aria-components';

/**
 * Props for the PopoverTrigger component.
 */
export type PopoverTriggerProps = ComponentPropsWithRef<'div'> &
  DialogTriggerProps;

/**
 * Props for the Popover component.
 */
export type PopoverProps = Omit<AriaPopoverProps, 'children' | 'className'> &
  Pick<DialogProps, 'children'> & {
    /** CSS class names for popover elements. */
    classNames?: {
      /** Class name for the popover container. */
      popover?: AriaPopoverProps['className'];
      /** Class name for the dialog content. */
      dialog?: DialogProps['className'];
    };
    /** Additional props passed to the Dialog component. */
    dialogProps?: Omit<DialogProps, 'children' | 'className'>;
  };

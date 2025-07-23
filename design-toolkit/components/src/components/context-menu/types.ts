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
import type { MenuTriggerProps as AriaMenuTriggerProps } from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { ContextMenuStyles } from './styles';

/** * ContextMenuProps defines the properties for the ContextMeny component.
 * It includes an array of actions, each with a unique label and an optional onAction callback.
 * The component renders a kebab menu icon that, when clicked, displays the actions in a popover.
 * @property onOpen - An optional callback function that is called when the menu is opened.
 * @property actions - An array of action objects, each containing a label and an optional onAction function.
 */
export type ContextMenuProps = VariantProps<typeof ContextMenuStyles> &
  PropsWithChildren<Pick<AriaMenuTriggerProps, 'isOpen' | 'onOpenChange'>> & {
    className?: string;
    actions: {
      label: string;
      onAction?: () => void;
    }[];
  };

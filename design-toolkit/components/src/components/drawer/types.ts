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

import type { ReactNode, RefAttributes, RefObject } from 'react';
import type { DrawerStyleVariants } from './styles';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerContextValue {
  position: DrawerPosition;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  parentRef?: RefObject<HTMLElement | null>;
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
}

export type DrawerProps = Pick<
  DrawerStyleVariants,
  'position' | 'isDismissable' | 'isKeyboardDismissDisabled'
> &
  RefAttributes<HTMLDivElement> & {
    children: ReactNode;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    parentRef?: RefObject<HTMLElement | null>;
  };

export type DrawerTriggerProps = {
  children:
    | ReactNode
    | ((props: { isOpen?: boolean; onPress: () => void }) => ReactNode);
} & RefAttributes<HTMLDivElement>;

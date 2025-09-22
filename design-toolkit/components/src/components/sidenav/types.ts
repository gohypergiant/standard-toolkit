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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { ComponentPropsWithRef, PropsWithChildren } from 'react';
import type {
  ButtonProps,
  DisclosurePanelProps,
  DisclosureProps,
  LinkProps,
  PopoverProps,
  Pressable,
  ToggleButtonProps,
} from 'react-aria-components';
import type { SidenavEventTypes } from './events';

export type SidenavProps = ComponentPropsWithRef<'nav'> & {
  id: UniqueId;
  isHiddenWhenClosed?: boolean;
};

export type SidenavHeaderProps = PropsWithChildren<{
  classNames?: {
    header?: string;
    button?: ButtonProps['className'];
    container?: string;
    icon?: string;
  };
}>;

export type SidenavContentProps = ComponentPropsWithRef<'div'>;

export type SidenavItemProps = ToggleButtonProps & {
  classNames?: {
    button?: ToggleButtonProps['className'];
    icon?: string;
  };
  textValue?: string;
};

export type SidenavLinkProps = LinkProps & {
  classNames?: {
    button?: LinkProps['className'];
    icon?: string;
  };
  textValue: string;
};

export type SidenavAvatarProps = ComponentPropsWithRef<'div'>;

export type SidenavDividerProps = ComponentPropsWithRef<'hr'>;

export type SidenavFooterProps = ComponentPropsWithRef<'footer'>;

export type SidenavCloseEvent = Payload<
  typeof SidenavEventTypes.close,
  {
    id: UniqueId;
  }
>;

export type SidenavOpenEvent = Payload<
  typeof SidenavEventTypes.open,
  {
    id: UniqueId;
  }
>;

export type SidenavToggleEvent = Payload<
  typeof SidenavEventTypes.toggle,
  {
    id: UniqueId;
  }
>;

export type SidenavEvent =
  | SidenavOpenEvent
  | SidenavToggleEvent
  | SidenavCloseEvent;

type TargetedEvents =
  | `close:${UniqueId}`
  | `open:${UniqueId}`
  | `toggle:${UniqueId}`;

export type SidenavTriggerProps = ComponentPropsWithRef<typeof Pressable> & {
  for: TargetedEvents | UniqueId;
};

export type SidenavContextValue = {
  id: UniqueId;
  isOpen: boolean;
};

export type SidenavMenuProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  classNames?: {
    menu?: DisclosureProps['className'];
    button?: ButtonProps['className'];
    icon?: string;
    disclosurePanel?: DisclosurePanelProps['className'];
    popoverPanel?: PopoverProps['className'];
    panelContent?: string;
  };
};

export type SidenavMenuItemProps = ToggleButtonProps;

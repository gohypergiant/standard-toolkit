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

/**
 * Props for Sidenav component.
 * - `id` - Unique identifier for the sidenav.
 * - `isHiddenWhenClosed` - Whether to hide the sidenav when closed.
 */
export type SidenavProps = ComponentPropsWithRef<'nav'> & {
  id: UniqueId;
  isHiddenWhenClosed?: boolean;
};

/**
 * Props for SidenavHeader component.
 * - `classNames.header` - CSS class for the header container.
 * - `classNames.button` - CSS class for the toggle button.
 * - `classNames.container` - CSS class for the content container.
 * - `classNames.icon` - CSS class for the chevron icon.
 */
export type SidenavHeaderProps = PropsWithChildren<{
  classNames?: {
    header?: string;
    button?: ButtonProps['className'];
    container?: string;
    icon?: string;
  };
}>;

/** Props for SidenavContent component. */
export type SidenavContentProps = ComponentPropsWithRef<'div'>;

/**
 * Props for SidenavItem component.
 * - `classNames.button` - CSS class for the toggle button.
 * - `classNames.icon` - CSS class for the icon.
 * - `textValue` - Text displayed in tooltip when sidenav is collapsed.
 */
export type SidenavItemProps = ToggleButtonProps & {
  classNames?: {
    button?: ToggleButtonProps['className'];
    icon?: string;
  };
  textValue?: string;
};

/**
 * Props for SidenavLink component.
 * - `classNames.button` - CSS class for the link.
 * - `classNames.icon` - CSS class for the icon.
 * - `textValue` - Text displayed in tooltip when sidenav is collapsed.
 */
export type SidenavLinkProps = LinkProps & {
  classNames?: {
    button?: LinkProps['className'];
    icon?: string;
  };
  textValue: string;
};

/** Props for SidenavAvatar component. */
export type SidenavAvatarProps = ComponentPropsWithRef<'div'>;

/** Props for SidenavDivider component. */
export type SidenavDividerProps = ComponentPropsWithRef<'hr'>;

/** Props for SidenavFooter component. */
export type SidenavFooterProps = ComponentPropsWithRef<'footer'>;

/** Event payload for closing a sidenav. */
export type SidenavCloseEvent = Payload<
  typeof SidenavEventTypes.close,
  {
    id: UniqueId;
  }
>;

/** Event payload for opening a sidenav. */
export type SidenavOpenEvent = Payload<
  typeof SidenavEventTypes.open,
  {
    id: UniqueId;
  }
>;

/** Event payload for toggling a sidenav. */
export type SidenavToggleEvent = Payload<
  typeof SidenavEventTypes.toggle,
  {
    id: UniqueId;
  }
>;

/** Union of all sidenav event types. */
export type SidenavEvent =
  | SidenavOpenEvent
  | SidenavToggleEvent
  | SidenavCloseEvent;

type TargetedEvents =
  | `close:${UniqueId}`
  | `open:${UniqueId}`
  | `toggle:${UniqueId}`;

/**
 * Props for SidenavTrigger component.
 * - `for` - Target sidenav ID or targeted event string (e.g., 'open:id', 'close:id').
 */
export type SidenavTriggerProps = ComponentPropsWithRef<typeof Pressable> & {
  for: TargetedEvents | UniqueId;
};

/**
 * Context value for Sidenav.
 * - `id` - Unique identifier of the sidenav.
 * - `isOpen` - Whether the sidenav is currently open.
 */
export type SidenavContextValue = {
  id: UniqueId;
  isOpen: boolean;
};

/**
 * Props for SidenavMenu component.
 * - `title` - Menu title displayed in header.
 * - `icon` - Icon displayed before the title.
 * - `classNames.menu` - CSS class for the disclosure container.
 * - `classNames.button` - CSS class for the trigger button.
 * - `classNames.icon` - CSS class for the chevron icon.
 * - `classNames.disclosurePanel` - CSS class for expanded panel.
 * - `classNames.popoverPanel` - CSS class for popover panel (collapsed state).
 * - `classNames.panelContent` - CSS class for panel content wrapper.
 */
export type SidenavMenuProps = PropsWithChildren & {
  title: string;
  icon: React.ReactNode;
  classNames?: {
    menu?: DisclosureProps['className'];
    button?: ButtonProps['className'];
    icon?: string;
    disclosurePanel?: DisclosurePanelProps['className'];
    popoverPanel?: PopoverProps['className'];
    panelContent?: string;
  };
};

/** Props for SidenavMenuItem component. */
export type SidenavMenuItemProps = ToggleButtonProps;

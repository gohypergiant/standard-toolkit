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

import type { ComponentPropsWithRef, PropsWithChildren } from 'react';
import type {
  LinkProps,
  Pressable,
  ToggleButtonProps,
} from 'react-aria-components';

export type SidenavProps = ComponentPropsWithRef<'nav'> & {
  isHiddenWhenClosed?: boolean;
};

export type SidenavHeaderProps = PropsWithChildren<{
  classNames?: {
    header?: string;
    button?: string;
    container?: string;
    icon?: string;
  };
}>;

export type SidenavContentProps = ComponentPropsWithRef<'div'>;

export type SidenavItemProps = ToggleButtonProps & {
  classNames?: {
    button?: string;
    icon?: string;
  };
  textValue: string;
};

export type SidenavLinkProps = LinkProps & {
  classNames?: {
    button?: string;
    icon?: string;
  };
  textValue: string;
};

export type SidenavAvatarProps = ComponentPropsWithRef<'div'>;

export type SidenavDividerProps = ComponentPropsWithRef<'hr'>;

export type SidenavFooterProps = ComponentPropsWithRef<'footer'>;

export type SidenavTriggerProps = ComponentPropsWithRef<typeof Pressable>;

export type SidenavContextValue = {
  open: boolean;
};

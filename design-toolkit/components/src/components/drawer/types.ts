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
import type { UniqueId } from '@accelint/core';
import type { FocusableElement } from '@react-types/shared';
import type { ComponentPropsWithRef, DOMAttributes, ReactElement } from 'react';
import type { ButtonProps } from '../button/types';
import type { ViewStackProps } from '../view-stack/types';

type Top = 'top';
type Bottom = 'bottom';
type YAxisUnion = Top | Bottom;
type YAxisIntersection = `${Top} ${Bottom}` | `${Bottom} ${Top}`;
type Right = 'right';
type Left = 'left';
type XAxisUnion = Right | Left;
type XAxisIntersection = `${Right} ${Left}` | `${Left} ${Right}`;

export type DrawerLayoutProps = ComponentPropsWithRef<'div'> & {
  /**
   * Which drawers should extend to full container dimensions.
   * Determines the overall layout structure and drawer relationships in regard to space.
   *
   * @default 'left right'
   *
   * Extended Drawer Layout Configurations
   *
   * The layout system supports four different drawer extension modes that determine
   * how drawers are arranged and which drawers extend to the full container dimensions.
   *
   * extend: "left right"
   * ┌──────┬──────────┬───────┐
   * │      │   top    │       │
   * │      ├──────────┤       │
   * │ left │   main   │ right │
   * │      ├──────────┤       │
   * │      │  bottom  │       │
   * └──────┴──────────┴───────┘
   *
   * extend: "top bottom"
   * ┌─────────────────────────┐
   * │          top            │
   * ├──────┬──────────┬───────┤
   * │ left │   main   │ right │
   * ├──────┴──────────┴───────┤
   * │         bottom          │
   * └─────────────────────────┘
   *
   * extend: "top"
   * ┌─────────────────────────┐
   * │          top            │
   * ├──────┬──────────┬───────┤
   * │      │   main   │       │
   * │ left ├──────────┤ right │
   * │      │  bottom  │       │
   * └──────┴──────────┴───────┘
   *
   * extend: "bottom"
   * ┌──────┬──────────┬───────┐
   * │      │   top    │       │
   * │ left ├──────────┤ right │
   * │      │   main   │       │
   * ├──────┴──────────┴───────┤
   * │         bottom          │
   * └─────────────────────────┘
   *
   * extend: "left"
   * ┌──────┬──────────────────┐
   * │      │   top            │
   * │      ├──────────┬───────│
   * │ left │   main   │ right │
   * │      ├──────────┴───────┤
   * │      │  bottom          │
   * └──────┴──────────────────┘
   *
   * extend: "right"
   * ┌─────────────────┬───────┐
   * │          top    │       │
   * ├──────┬──────────┤       │
   * │ left │   main   │ right │
   * ├──────┴──────────┤       │
   * │         bottom  │       │
   * └─────────────────┴───────┘
   */
  extend?: XAxisUnion | XAxisIntersection | YAxisUnion | YAxisIntersection;
  /**
   * Determines how drawer interact with the main content area and overall layout:
   *
   * - `'push'`: Drawer pushes the main content aside, reducing its available width.
   *   Content area shrinks to accommodate the panel space.
   *   If no placements are defined for push, the default behavior for a drawer is to float over the main content without affecting its layout or dimensions.
   *   Content remains at full width, panel appears as an overlay.
   */
  push?:
    | XAxisUnion
    | YAxisUnion
    | `${XAxisUnion | XAxisIntersection} ${YAxisUnion | YAxisIntersection}`
    | `${YAxisUnion | YAxisIntersection} ${XAxisUnion | XAxisIntersection}`;
};

export type DrawerProps = Omit<ViewStackProps, 'onChange'> &
  ComponentPropsWithRef<'div'> & {
    /**
     * The placement of the drawer.
     * @default 'left'
     */
    placement: XAxisUnion | YAxisUnion;
    /**
     * The size of the drawer.
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Whether the drawer is open or not.
     * @default false
     */
    defaultIsOpen?: boolean;
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
  };

export type DrawerMenuProps = ComponentPropsWithRef<'nav'> & {
  /**
   * The position of the menu.
   * @default 'center'
   */
  position?: 'start' | 'center' | 'end';
};

export type DrawerMenuItemProps = Omit<ButtonProps, 'id'> & {
  id: UniqueId;
  /**
   * Pass an array of associated views if the tab should display as active
   *
   * Do not need to include the `id` already passed
   */
  views?: UniqueId[];
};

export type DrawerCloseEvent = {
  drawer: UniqueId;
};

export type DrawerOpenEvent = {
  drawer: UniqueId;
  view: UniqueId;
};

export type DrawerToggleEvent = {
  drawer: UniqueId;
};

export type DrawerSelectEvent = {
  view: UniqueId;
};

type SimpleEvents = 'back' | 'clear' | 'close' | 'reset' | UniqueId;

type TargetedEvents =
  | `back:${UniqueId}`
  | `clear:${UniqueId}`
  | `close:${UniqueId}`
  | `open:${UniqueId}`
  | `reset:${UniqueId}`
  | `select:${UniqueId}`
  | `toggle:${UniqueId}`;

type ChainedEvents = (SimpleEvents | TargetedEvents)[];

export type DrawerTriggerProps = {
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
  /**
   * __SimpleEvents__ allow the easiest implementation of events, but come with some restrictions:
   * - The literal commands `back | clear | close | reset` will only work inside of the context of a Drawer
   * - When passing a view's UniqueId the behavior is always to push that id onto it's parent's stack
   *
   * __TargetedEvents__ allow for external control of a Drawer, the UniqueId of a Drawer is passed to know which drawer to affect
   *
   * __ChainedEvents__ allow a list of events from a single control to enable multiple behaviors
   *
   * @example
   * // Reset a drawer stack and then push a view on:
   * ['reset', myViewId]
   *
   * // Open multiple drawers:
   * [`open:${stackOneId}`, `open:${stackTwoId}`]
   *
   * // Push multiple views to multiple drawers:
   * [viewOneId, viewTwoId, viewThreeId]
   */
  for: SimpleEvents | TargetedEvents | ChainedEvents;
};

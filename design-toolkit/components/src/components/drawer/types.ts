import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { FocusableElement } from '@react-types/shared';
import type {
  ComponentPropsWithRef,
  DOMAttributes,
  ReactElement,
  RefAttributes,
} from 'react';
import type { HeadingProps } from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
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
import type { AriaAttributesWithRef } from '@/lib/types';
import type { ToggleButtonProps } from '../button/types';
import type { ViewStackEvent } from '../view-stack/types';
import type { DrawerEventTypes } from './events';
import type { DrawerTitleStyles } from './styles';

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
    | XAxisIntersection
    | YAxisIntersection
    | `${XAxisUnion} ${YAxisUnion}`
    | `${YAxisUnion} ${XAxisUnion}`
    | `${XAxisUnion} ${YAxisIntersection}`
    | `${YAxisIntersection} ${XAxisUnion}`
    | `${YAxisUnion} ${XAxisIntersection}`
    | `${XAxisIntersection} ${YAxisUnion}`
    | `${XAxisIntersection} ${YAxisIntersection}`
    | `${YAxisIntersection} ${XAxisIntersection}`;
};

export type DrawerProps = Omit<ComponentPropsWithRef<'div'>, 'onChange'> & {
  id: UniqueId;
  defaultView?: UniqueId;
  /**
   * The placement of the drawer.
   * @default 'left'
   */
  placement?: XAxisUnion | YAxisUnion;
  /**
   * The size of the drawer.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  onChange?: (view: UniqueId | null) => void;
};

export type DrawerMenuProps = ComponentPropsWithRef<'nav'> & {
  /**
   * The position of the menu.
   * @default 'center'
   */
  position?: 'start' | 'center' | 'end';
};

/**
 * DrawerMenuItem implements DrawerTrigger with the default behavior of
 * the trigger's `open` event type, which resets the stack before pushing the new view
 */
export type DrawerMenuItemProps = Omit<
  ToggleButtonProps,
  'id' | 'isSelected' | 'className'
> & {
  /**
   * The unique identifier of the view that this menu item controls.
   *
   * Links the menu item to a specific view, enabling it to open or toggle the associated view when activated.
   *
   * The value should match the `id` of the target view component. This prop is required for correct association and interaction.
   *
   * If the menu item is intended to control multiple views, use the `views` prop for additional associations; do not include the `for` id in the `views` array.
   */
  for: UniqueId;

  /**
   * If set to `true`, the menu item will toggle the visibility of the associated view each time it is activated.
   *
   * By default, the menu item only opens the view. Use this prop to enable toggling between open and closed states.
   */
  toggle?: boolean;

  /**
   * When set this will be the text for the tooltip
   */
  textValue: string;

  /**
   * Class names to be applied to the item and tooltip
   */
  classNames?: {
    item?: string;
    tooltip?: string;
  };
};

export type DrawerTitleProps = Omit<HeadingProps, 'level'> &
  AriaAttributesWithRef<HTMLHeadingElement> &
  VariantProps<typeof DrawerTitleStyles>;

export type DrawerOpenEvent = Payload<
  typeof DrawerEventTypes.open,
  {
    view: UniqueId;
  }
>;

export type DrawerToggleEvent = Payload<
  typeof DrawerEventTypes.toggle,
  {
    view: UniqueId;
  }
>;

export type DrawerEvent = DrawerOpenEvent | DrawerToggleEvent | ViewStackEvent;

type SimpleEvents = 'back' | 'clear' | 'close' | 'reset' | UniqueId;

type TargetedEvents =
  | `back:${UniqueId}`
  | `clear:${UniqueId}`
  | `close:${UniqueId}`
  | `open:${UniqueId}`
  | `toggle:${UniqueId}`
  | `reset:${UniqueId}`;

type ChainedEvents = (SimpleEvents | TargetedEvents)[];

export type DrawerTriggerProps = RefAttributes<FocusableElement> & {
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
   * _NOTE_: Open differs from Push (just a UniqueId), Open clears the stack before pushing the new view
   *
   * @example
   * // Reset a drawer stack and then push a view on:
   * ['reset', myViewId]
   *
   * // Open multiple drawers:
   * [`open:${tabOneId}`, `open:${tabCId}`]
   *
   * // Push multiple views to multiple drawers:
   * [viewOneId, viewTwoId, viewThreeId]
   *
   * // Close the current drawer from inside its context:
   * 'close'
   */
  for: SimpleEvents | TargetedEvents | ChainedEvents;
};

export type DrawerContextValue = {
  register: (view: UniqueId) => void;
  unregister: (view: UniqueId) => void;
  placement: XAxisUnion | YAxisUnion;
};

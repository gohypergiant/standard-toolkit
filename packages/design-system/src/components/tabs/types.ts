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

import type { Orientation, PressEvents } from '@react-types/shared';
import type { PropsWithChildren } from 'react';
import type {
  TabListProps as RACTabListProps,
  TabPanelProps as RACTabPanelProps,
  TabPanelRenderProps as RACTabPanelRenderProps,
  TabProps as RACTabProps,
  TabRenderProps as RACTabRenderProps,
  TabsProps as RACTabsProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';

export type TabsClassNames = PartialDeep<{
  tabs: string;
  list: {
    container: string;
    list: string;
  };
  tab: {
    container: string;
    tab: string;
  };
  panels: {
    container: string;
    panels: string;
  };
  panel: {
    container: string;
    panel: string;
  };
}>;

export type TabListVariants = 'border' | 'fill';

export type TabListAnchor = 'start' | 'end';

export type TabListAlignment = 'start' | 'center' | 'end';

export type TabListSizes = 'sm' | 'lg';

export type TabRenderProps = AsType<RACTabRenderProps>;

export type TabPanelRenderProps = AsType<RACTabPanelRenderProps>;

type BaseProps = {
  classNames?: TabsClassNames;
};

type BaseTabListProps = {
  align?: TabListAlignment;
  /**
   * To be combined with orientation, where:
   * orientation=horizontal + anchor=end = bottom
   * orientation=horizontal + anchor=start = top
   * orientation=vertical + anchor=end = right
   * orientation=vertical + anchor=start = left
   */
  anchor?: TabListAnchor;
  orientation?: Orientation;
  size?: TabListSizes;
  variant?: TabListVariants;
};

type BaseTabProps = {
  /**
   * Must match cooresponding TabPanel id, should be
   * unique to all other ids
   */
  id: string;
} & PressEvents;

type BaseTabPanelsProps = PropsWithChildren<{
  /**
   * Setting this to true will apply to all panels and
   * change the layout to a stacked approach that grows
   * to the size of the largest panel content, no matter
   * which panel is active
   */
  shouldForceMount?: boolean;
}>;

type BaseTabPanelProps = {
  /**
   * Must match cooresponding Tab id, should be unique
   * to all other ids
   */
  id: string;
};

export type TabListState = Required<BaseTabListProps> & {
  count: number;
};

export type TabState = AsType<RACTabRenderProps>;

export type TabPanelsState = Required<
  Pick<BaseTabPanelsProps, 'shouldForceMount'>
>;

export type TabPanelState = Omit<TabPanelRenderProps, 'state'> &
  Required<Pick<RACTabPanelProps, 'shouldForceMount'>>;

export type TabsProps = Omit<RACTabsProps, 'children' | 'className' | 'style'> &
  PropsWithChildren<BaseProps>;

export type TabListProps<T> = Omit<RACTabListProps<T>, 'className' | 'style'> &
  BaseTabListProps &
  BaseProps;

export type TabProps = Omit<RACTabProps, 'className' | 'style'> &
  BaseTabProps &
  BaseProps;

export type TabPanelsProps = BaseTabPanelsProps & BaseProps;

export type TabPanelProps = Omit<RACTabPanelProps, 'className' | 'style'> &
  BaseTabPanelProps &
  BaseProps;

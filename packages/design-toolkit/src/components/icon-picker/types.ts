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

import type { ComponentType, RefAttributes, SVGProps } from 'react';
import type { GridListItemProps, GridListProps } from 'react-aria-components';

type SVGRProps = {
  title?: string;
  titleId?: string;
};

export type IconPickerIcon = ComponentType<SVGProps<SVGSVGElement> & SVGRProps>;

export type IconPickerItem = {
  id: string;
  icon: IconPickerIcon;
  label: string;
};

export type IconPickerProps = Omit<
  GridListProps<IconPickerItem>,
  | 'children'
  | 'dragAndDropHooks'
  | 'keyboardNavigationBehavior'
  | 'layout'
  | 'orientation'
  | 'selectionBehavior'
  | 'selectionMode'
> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      picker?: GridListProps<IconPickerItem>['className'];
      item?: GridListItemProps<IconPickerItem>['className'];
      icon?: string;
    };
    items: IconPickerItem[];
  };

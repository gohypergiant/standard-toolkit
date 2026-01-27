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
'use client';

import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import {
  composeRenderProps,
  GridList,
  GridListItem,
} from 'react-aria-components';
import { Icon } from '../icon';
import styles from './styles.module.css';
import type { IconPickerProps } from './types';

/**
 * An icon picker component that renders a grid of icon swatches for selection.
 *
 * This component provides a simple interface for users to select from a predefined
 * set of icons. It renders each icon as an interactive swatch that can be clicked
 * to select that icon. The component supports keyboard navigation, accessibility
 * features, and fine-grained styling control through the classNames prop.
 *
 * @param items - Array of icon items to display as selectable swatches
 * @param classNames - Object containing CSS class names for fine-grained styling control
 * @param classNames.picker - CSS class name for the main picker container
 * @param classNames.item - CSS class name for individual icon items
 * @param classNames.icon - CSS class name for the icon elements
 *
 * @example
 * ```tsx
 * import Add from '@accelint/icons/add';
 * import Settings from '@accelint/icons/settings';
 * import User from '@accelint/icons/user';
 *
 * const icons = [
 *   { id: 'add', icon: Add, label: 'Add' },
 *   { id: 'settings', icon: Settings, label: 'Settings' },
 *   { id: 'user', icon: User, label: 'User' },
 * ];
 *
 * <IconPicker
 *   items={icons}
 *   selectedKeys={['settings']}
 *   onSelectionChange={(keys) => console.log('Selected:', keys)}
 *   classNames={{
 *     picker: 'gap-4',
 *     item: 'rounded-lg',
 *     icon: 'w-8 h-8'
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Icons should be provided as React components from @accelint/icons
 * - The component automatically handles accessibility features from react-aria-components
 * - Uses a grid layout by default that wraps based on container width
 */
export function IconPicker({ classNames, items, ...rest }: IconPickerProps) {
  return (
    <GridList
      {...rest}
      items={items}
      aria-label={rest['aria-label'] ?? 'Icon picker'}
      selectionMode='single'
      className={composeRenderProps(classNames?.picker, (className) =>
        clsx(styles.picker, className),
      )}
    >
      {(item) => (
        <GridListItem
          id={item.id}
          textValue={item.label}
          className={composeRenderProps(classNames?.item, (className) =>
            clsx(styles.item, className),
          )}
        >
          <Icon className={classNames?.icon}>
            <item.icon aria-hidden='true' />
          </Icon>
        </GridListItem>
      )}
    </GridList>
  );
}

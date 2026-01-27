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
import { createContext } from 'react';
import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { ChipContext, ChipProvider } from './context';
import styles from './styles.module.css';
import type { ChipListProps } from './types';

/**
 * React context indicating whether chips are being rendered inside a ChipList.
 */
export const ChipListRenderingContext = createContext(false);

/**
 * ChipList - Container component for grouping multiple chips with shared behavior.
 *
 * Provides context for size and color, and enables selection and removal functionality.
 *
 * @param props - The chip list props.
 * @param props.ref - Reference to the list container element.
 * @param props.children - Chip components to render in the list.
 * @param props.className - Additional CSS class names for styling.
 * @param props.color - Default color for all chips in the list.
 * @param props.size - Default size for all chips in the list.
 * @param props.selectionMode - Enable single or multiple selection.
 * @param props.onRemove - Callback when chips are removed.
 * @returns The chip list component.
 *
 * @example
 * ```tsx
 * // Basic list
 * <ChipList>
 *   <Chip color="info">React</Chip>
 *   <Chip color="advisory">TypeScript</Chip>
 * </ChipList>
 * ```
 *
 * @example
 * ```tsx
 * // Selectable chips
 * <ChipList selectionMode="multiple" onSelectionChange={handleChange}>
 *   <SelectableChip id="react">React</SelectableChip>
 *   <SelectableChip id="vue">Vue</SelectableChip>
 * </ChipList>
 * ```
 *
 * @example
 * ```tsx
 * // Deletable chips
 * <ChipList onRemove={(keys) => console.log('Removed:', keys)}>
 *   <DeletableChip id="tag1">Tag 1</DeletableChip>
 *   <DeletableChip id="tag2">Tag 2</DeletableChip>
 * </ChipList>
 * ```
 */
export function ChipList<T extends object>({
  ref,
  ...props
}: ChipListProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const {
    children,
    className,
    color,
    dependencies,
    items,
    renderEmptyState,
    size = 'small',
    ...rest
  } = props;

  return (
    <ChipListRenderingContext.Provider value>
      <ChipProvider color={color} size={size}>
        <AriaTagGroup {...rest}>
          <AriaTagList<T>
            ref={ref}
            className={composeRenderProps(className, (className) =>
              clsx('group/chip-list', styles.list, className),
            )}
            dependencies={dependencies}
            items={items}
            renderEmptyState={renderEmptyState}
          >
            {children}
          </AriaTagList>
        </AriaTagGroup>
      </ChipProvider>
    </ChipListRenderingContext.Provider>
  );
}

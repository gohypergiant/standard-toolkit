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
import { useContext } from 'react';
import { Tag as AriaTag, useContextProps } from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { ChipContext } from './context';
import { ChipListRenderingContext } from './list';
import { ChipStyles, ChipStylesDefaults } from './styles';
import type { ChipProps } from './types';

const { chip } = ChipStyles();

/**
 * Chip - A compact element for displaying tags, filters, or selectable items
 *
 * Provides flexible chip functionality supporting both individual chips and chip lists.
 * Includes variants for deletable and selectable chips with keyboard navigation and
 * accessibility features. Perfect for tags, filters, or multi-selection interfaces.
 *
 * @example
 * // Basic chip
 * <Chip>JavaScript</Chip>
 *
 * @example
 * // Chip list with multiple items
 * <ChipList>
 *   <Chip>React</Chip>
 *   <Chip>TypeScript</Chip>
 *   <Chip>Node.js</Chip>
 * </ChipList>
 *
 * @example
 * // Deletable chips
 * <ChipList onRemove={() => console.log('removed')}>
 *   <DeletableChip>
 *     Removable Tag
 *   </DeletableChip>
 * </ChipList>
 *
 * @example
 * // Selectable chips
 * <ChipList selectionMode="multiple">
 *   <SelectableChip id="option1">Option 1</SelectableChip>
 *   <SelectableChip id="option2">Option 2</SelectableChip>
 * </ChipList>
 */
export function Chip({ ref, ...props }: ChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const context = useContext(ChipListRenderingContext);
  const Component = context ? AriaTag : 'div';
  const {
    className,
    size = 'medium',
    variant = ChipStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <IconProvider size={size === 'medium' ? 'small' : 'xsmall'}>
      <Component
        {...rest}
        ref={ref}
        className={chip({ size, variant, className })}
        data-size={size}
      />
    </IconProvider>
  );
}

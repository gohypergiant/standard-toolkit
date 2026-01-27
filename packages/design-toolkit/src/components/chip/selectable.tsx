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
  Tag as AriaTag,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { ChipContext } from './context';
import styles from './styles.module.css';
import type { SelectableChipProps } from './types';

/**
 * SelectableChip - Interactive chip that can be selected/deselected for filtering.
 *
 * Must be used inside a ChipList with selectionMode set to "single" or "multiple".
 *
 * @param props - The selectable chip props.
 * @param props.ref - Reference to the chip element.
 * @param props.id - Unique identifier for selection tracking.
 * @param props.className - Additional CSS class names for styling.
 * @param props.color - Semantic color variant.
 * @param props.size - Size of the chip.
 * @param props.children - Chip content.
 * @returns The selectable chip component.
 *
 * @example
 * ```tsx
 * <ChipList selectionMode="multiple">
 *   <SelectableChip id="react">React</SelectableChip>
 *   <SelectableChip id="vue">Vue</SelectableChip>
 * </ChipList>
 * ```
 *
 * @example
 * ```tsx
 * // With colors
 * <ChipList selectionMode="single">
 *   <SelectableChip id="up" color="normal">UP</SelectableChip>
 *   <SelectableChip id="down" color="critical">DOWN</SelectableChip>
 * </ChipList>
 * ```
 */
export function SelectableChip({ ref, ...props }: SelectableChipProps) {
  [props, ref] = useContextProps(props, ref ?? null, ChipContext);

  const { className, color, size = 'medium', ...rest } = props;

  return (
    <AriaTag
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        clsx('group/chip', styles.chip, styles.selectable, className),
      )}
      data-color={color}
      data-size={size}
    />
  );
}

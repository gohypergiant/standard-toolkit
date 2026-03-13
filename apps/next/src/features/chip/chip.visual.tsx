/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Chip } from '@accelint/design-toolkit/components/chip';
import { DeletableChip } from '@accelint/design-toolkit/components/chip/deletable';
import { ChipList } from '@accelint/design-toolkit/components/chip/list';
import { SelectableChip } from '@accelint/design-toolkit/components/chip/selectable';
import { Icon } from '@accelint/design-toolkit/components/icon';
import PlaceholderIcon from '@accelint/icons/placeholder';
import {
  createInteractiveVisualTests,
  generateVariantMatrix,
} from '~/visual-regression/vitest';
import type { ChipProps } from '@accelint/design-toolkit/components/chip/types';

// ---------------------------------------------------------------------------
// 1. Chip — static, all color x size combos (non-interactive)
// ---------------------------------------------------------------------------

const chipVariants = generateVariantMatrix<ChipProps>({
  dimensions: {
    color: ['info', 'advisory', 'normal', 'serious', 'critical'],
    size: ['medium', 'small'],
  },
});

createInteractiveVisualTests({
  componentName: 'Chip',
  renderComponent: (props) => (
    <Chip {...props}>
      <Icon>
        <PlaceholderIcon />
      </Icon>
      Chip
    </Chip>
  ),
  testId: 'test-chip',
  variants: chipVariants,
  states: ['default'],
});

// ---------------------------------------------------------------------------
// 2. SelectableChip — interactive states across colors and sizes
// ---------------------------------------------------------------------------

type SelectableVariantProps = {
  color: ChipProps['color'];
  size: ChipProps['size'];
  isDisabled?: boolean;
};

const selectableVariants = generateVariantMatrix<SelectableVariantProps>({
  dimensions: {
    color: ['info', 'advisory', 'normal', 'serious', 'critical'],
    size: ['medium', 'small'],
  },
});

createInteractiveVisualTests({
  componentName: 'SelectableChip',
  renderComponent: ({ color, size, isDisabled }) => (
    <ChipList
      selectionMode='multiple'
      items={[{ id: 'chip-1', label: 'Selectable' }]}
      size={size}
      disabledKeys={isDisabled ? ['chip-1'] : undefined}
    >
      {({ id, label }) => (
        <SelectableChip id={id} color={color}>
          {label}
        </SelectableChip>
      )}
    </ChipList>
  ),
  testId: 'test-selectable-chip',
  variants: selectableVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  interactionTarget: '[role="row"]',
});

// ---------------------------------------------------------------------------
// 3. DeletableChip — interactive states across sizes (no color dimension)
// ---------------------------------------------------------------------------

type DeletableVariantProps = {
  size: ChipProps['size'];
  isDisabled?: boolean;
};

const deletableVariants = generateVariantMatrix<DeletableVariantProps>({
  dimensions: {
    size: ['medium', 'small'],
  },
});

createInteractiveVisualTests({
  componentName: 'DeletableChip',
  renderComponent: ({ size, isDisabled }) => (
    <ChipList
      items={[{ id: 'chip-1', label: 'Deletable' }]}
      size={size}
      onRemove={() => {}}
      disabledKeys={isDisabled ? ['chip-1'] : undefined}
    >
      {({ id, label }) => <DeletableChip id={id}>{label}</DeletableChip>}
    </ChipList>
  ),
  testId: 'test-deletable-chip',
  variants: deletableVariants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
  interactionTarget: '[role="row"]',
});

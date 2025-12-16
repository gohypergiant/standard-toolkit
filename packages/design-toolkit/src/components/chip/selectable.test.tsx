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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChipList } from './list';
import { SelectableChip } from './selectable';
import type { SelectableChipProps } from './types';

function setup(
  props: Partial<SelectableChipProps> & { children?: string } = {},
) {
  const { children = 'Selectable Chip', ...rest } = props;

  render(
    <ChipList selectionMode='single'>
      <SelectableChip id='test-chip' {...rest}>
        {children}
      </SelectableChip>
    </ChipList>,
  );

  return {
    children,
    ...rest,
  };
}

function setupMultiple() {
  const onSelectionChange = vi.fn();

  render(
    <ChipList selectionMode='multiple' onSelectionChange={onSelectionChange}>
      <SelectableChip id='chip-1' color='normal'>
        Chip 1
      </SelectableChip>
      <SelectableChip id='chip-2' color='critical'>
        Chip 2
      </SelectableChip>
      <SelectableChip id='chip-3' color='info'>
        Chip 3
      </SelectableChip>
    </ChipList>,
  );

  return { onSelectionChange };
}

describe('SelectableChip', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Selectable Chip')).toBeInTheDocument();
  });

  it('should apply data-color attribute when color prop is provided', () => {
    setup({ color: 'normal' });

    const chip = screen.getByText('Selectable Chip').closest('[data-color]');

    expect(chip).toHaveAttribute('data-color', 'normal');
  });

  it.each([
    'info',
    'advisory',
    'normal',
    'serious',
    'critical',
  ] as const)('should render with color="%s"', (color) => {
    setup({ color });

    const chip = screen.getByText('Selectable Chip').closest('[data-color]');

    expect(chip).toHaveAttribute('data-color', color);
  });

  it('should apply data-size attribute with default value from ChipList context', () => {
    setup();

    const chip = screen.getByText('Selectable Chip').closest('[data-size]');

    // ChipList defaults to 'small', which is passed via context
    expect(chip).toHaveAttribute('data-size', 'small');
  });

  it.each([
    'medium',
    'small',
  ] as const)('should render with size="%s"', (size) => {
    setup({ size });

    const chip = screen.getByText('Selectable Chip').closest('[data-size]');

    expect(chip).toHaveAttribute('data-size', size);
  });

  it('should apply custom className', () => {
    setup({ className: 'custom-selectable-class' });

    const chip = screen
      .getByText('Selectable Chip')
      .closest('.custom-selectable-class');

    expect(chip).toBeInTheDocument();
  });

  it('should be selectable on click', async () => {
    const user = userEvent.setup();

    setup();

    const chip = screen.getByText('Selectable Chip');

    await user.click(chip);

    expect(chip.closest('[aria-selected="true"]')).toBeInTheDocument();
  });

  it('should support multiple selection with different colors', async () => {
    const user = userEvent.setup();
    const { onSelectionChange } = setupMultiple();

    const chip1 = screen.getByText('Chip 1');
    const chip2 = screen.getByText('Chip 2');

    // Verify colors are applied
    expect(chip1.closest('[data-color]')).toHaveAttribute(
      'data-color',
      'normal',
    );
    expect(chip2.closest('[data-color]')).toHaveAttribute(
      'data-color',
      'critical',
    );

    // Select first chip
    await user.click(chip1);

    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('should toggle selection on repeated clicks', async () => {
    const user = userEvent.setup();

    setup();

    const chip = screen.getByText('Selectable Chip');

    // Select
    await user.click(chip);
    expect(chip.closest('[aria-selected="true"]')).toBeInTheDocument();

    // Deselect
    await user.click(chip);
    expect(chip.closest('[aria-selected="false"]')).toBeInTheDocument();
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();

    setup();

    const chip = screen.getByText('Selectable Chip');

    // Focus the chip
    await user.tab();

    // Select with Enter
    await user.keyboard('{Enter}');

    expect(chip.closest('[aria-selected="true"]')).toBeInTheDocument();
  });
});

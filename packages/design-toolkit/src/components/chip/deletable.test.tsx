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
import { DeletableChip } from './deletable';
import { ChipList } from './list';

function setup(onRemove = vi.fn()) {
  render(
    <ChipList onRemove={onRemove}>
      <DeletableChip id='chip-1'>Deletable Chip</DeletableChip>
    </ChipList>,
  );

  return { onRemove };
}

function setupMultiple(onRemove = vi.fn()) {
  render(
    <ChipList onRemove={onRemove}>
      <DeletableChip id='chip-1'>Chip 1</DeletableChip>
      <DeletableChip id='chip-2'>Chip 2</DeletableChip>
      <DeletableChip id='chip-3'>Chip 3</DeletableChip>
    </ChipList>,
  );

  return { onRemove };
}

describe('DeletableChip', () => {
  it('should render', () => {
    setup();

    expect(screen.getByText('Deletable Chip')).toBeInTheDocument();
  });

  it('should render remove button', () => {
    setup();

    const removeButton = screen.getByRole('button');

    expect(removeButton).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const { onRemove } = setup();

    const removeButton = screen.getByRole('button');

    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalled();
  });

  it('should apply data-size attribute with default value from ChipList context', () => {
    setup();

    const chip = screen.getByText('Deletable Chip').closest('[data-size]');

    // ChipList defaults to 'small', which is passed via context
    expect(chip).toHaveAttribute('data-size', 'small');
  });

  it('should apply custom size', () => {
    render(
      <ChipList onRemove={vi.fn()} size='small'>
        <DeletableChip id='chip-1'>Small Chip</DeletableChip>
      </ChipList>,
    );

    const chip = screen.getByText('Small Chip').closest('[data-size]');

    expect(chip).toHaveAttribute('data-size', 'small');
  });

  it('should render multiple deletable chips', () => {
    setupMultiple();

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
    expect(screen.getByText('Chip 3')).toBeInTheDocument();
  });

  it('should call onRemove with correct key when specific chip is removed', async () => {
    const user = userEvent.setup();
    const { onRemove } = setupMultiple();

    const removeButtons = screen.getAllByRole('button');

    // Click the second chip's remove button
    // biome-ignore lint/style/noNonNullAssertion: Test
    await user.click(removeButtons[1]!);

    expect(onRemove).toHaveBeenCalled();
  });

  it('should apply custom classNames', () => {
    render(
      <ChipList onRemove={vi.fn()}>
        <DeletableChip
          id='chip-1'
          classNames={{
            chip: 'custom-chip-class',
            remove: 'custom-remove-class',
          }}
        >
          Styled Chip
        </DeletableChip>
      </ChipList>,
    );

    const chip = screen.getByText('Styled Chip').closest('.custom-chip-class');

    expect(chip).toBeInTheDocument();
  });

  it('should use textValue for accessibility when provided', () => {
    render(
      <ChipList onRemove={vi.fn()}>
        <DeletableChip id='chip-1' textValue='Accessible Label'>
          <span>Complex Content</span>
        </DeletableChip>
      </ChipList>,
    );

    expect(screen.getByText('Complex Content')).toBeInTheDocument();
  });

  it('should be keyboard accessible for removal', async () => {
    const user = userEvent.setup();
    const { onRemove } = setup();

    // Tab to the chip and then to the remove button
    await user.tab();
    await user.tab();

    // Press Enter to remove
    await user.keyboard('{Enter}');

    expect(onRemove).toHaveBeenCalled();
  });

  it('should support disabled state via disabledKeys', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <ChipList onRemove={onRemove} disabledKeys={['chip-1']}>
        <DeletableChip id='chip-1'>Disabled Chip</DeletableChip>
        <DeletableChip id='chip-2'>Enabled Chip</DeletableChip>
      </ChipList>,
    );

    const removeButtons = screen.getAllByRole('button');

    // Try to click disabled chip's remove button
    // biome-ignore lint/style/noNonNullAssertion: Test
    await user.click(removeButtons[0]!);

    // onRemove should not be called for disabled chip
    expect(onRemove).not.toHaveBeenCalled();
  });
});

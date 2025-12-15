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
import { Chip } from './';
import { ChipList } from './list';
import { SelectableChip } from './selectable';

describe('ChipList', () => {
  it('should render children', () => {
    render(
      <ChipList>
        <Chip>Chip 1</Chip>
        <Chip>Chip 2</Chip>
      </ChipList>,
    );

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <ChipList className='custom-list-class'>
        <Chip>Chip 1</Chip>
      </ChipList>,
    );

    const list = screen.getByText('Chip 1').closest('.custom-list-class');

    expect(list).toBeInTheDocument();
  });

  it('should render items using render function', () => {
    const items = [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' },
      { id: '3', label: 'Item 3' },
    ];

    render(
      <ChipList selectionMode='single' items={items}>
        {({ id, label }) => <SelectableChip id={id}>{label}</SelectableChip>}
      </ChipList>,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should support single selection mode', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <ChipList selectionMode='single' onSelectionChange={onSelectionChange}>
        <SelectableChip id='chip-1'>Chip 1</SelectableChip>
        <SelectableChip id='chip-2'>Chip 2</SelectableChip>
      </ChipList>,
    );

    await user.click(screen.getByText('Chip 1'));

    expect(onSelectionChange).toHaveBeenCalled();
    expect(
      screen.getByText('Chip 1').closest('[aria-selected="true"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Chip 2').closest('[aria-selected="false"]'),
    ).toBeInTheDocument();
  });

  it('should support multiple selection mode', async () => {
    const user = userEvent.setup();

    render(
      <ChipList selectionMode='multiple'>
        <SelectableChip id='chip-1'>Chip 1</SelectableChip>
        <SelectableChip id='chip-2'>Chip 2</SelectableChip>
      </ChipList>,
    );

    await user.click(screen.getByText('Chip 1'));
    await user.click(screen.getByText('Chip 2'));

    expect(
      screen.getByText('Chip 1').closest('[aria-selected="true"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Chip 2').closest('[aria-selected="true"]'),
    ).toBeInTheDocument();
  });

  it('should support controlled selection with selectedKeys', () => {
    render(
      <ChipList selectionMode='multiple' selectedKeys={new Set(['chip-2'])}>
        <SelectableChip id='chip-1'>Chip 1</SelectableChip>
        <SelectableChip id='chip-2'>Chip 2</SelectableChip>
      </ChipList>,
    );

    expect(
      screen.getByText('Chip 1').closest('[aria-selected="false"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Chip 2').closest('[aria-selected="true"]'),
    ).toBeInTheDocument();
  });

  it('should support disabledKeys', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <ChipList
        selectionMode='single'
        disabledKeys={['chip-1']}
        onSelectionChange={onSelectionChange}
      >
        <SelectableChip id='chip-1'>Chip 1</SelectableChip>
        <SelectableChip id='chip-2'>Chip 2</SelectableChip>
      </ChipList>,
    );

    // Try to click disabled chip
    await user.click(screen.getByText('Chip 1'));

    // Selection should not change for disabled chip
    expect(
      screen.getByText('Chip 1').closest('[aria-selected="true"]'),
    ).not.toBeInTheDocument();
  });

  it('should pass size to children via context', () => {
    render(
      <ChipList size='small'>
        <Chip>Small Chip</Chip>
      </ChipList>,
    );

    const chip = screen.getByText('Small Chip').closest('[data-size]');

    expect(chip).toHaveAttribute('data-size', 'small');
  });

  it('should pass color to children via context', () => {
    render(
      <ChipList color='critical'>
        <Chip>Critical Chip</Chip>
      </ChipList>,
    );

    const chip = screen.getByText('Critical Chip').closest('[data-color]');

    expect(chip).toHaveAttribute('data-color', 'critical');
  });

  it('should render items with per-item colors', () => {
    const items = [
      { id: 'up', label: 'UP', color: 'normal' as const },
      { id: 'down', label: 'DOWN', color: 'critical' as const },
    ];

    render(
      <ChipList selectionMode='single' items={items}>
        {({ id, label, color }) => (
          <SelectableChip id={id} color={color}>
            {label}
          </SelectableChip>
        )}
      </ChipList>,
    );

    expect(screen.getByText('UP').closest('[data-color]')).toHaveAttribute(
      'data-color',
      'normal',
    );
    expect(screen.getByText('DOWN').closest('[data-color]')).toHaveAttribute(
      'data-color',
      'critical',
    );
  });
});

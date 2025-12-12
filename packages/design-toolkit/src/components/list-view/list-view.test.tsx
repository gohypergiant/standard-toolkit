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

import { Placeholder } from '@accelint/icons';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { Icon } from '../icon';
import { ListView } from '.';
import { ListViewItem } from './item';
import { ListViewItemContent } from './item-content';
import { ListViewItemDescription } from './item-description';
import { ListViewItemTitle } from './item-title';

describe('ListView', () => {
  it('renders basic list items', () => {
    render(
      <ListView>
        <ListViewItem>
          <Icon>
            <Placeholder />
          </Icon>
          <ListViewItemContent>
            <ListViewItemTitle>John Doe</ListViewItemTitle>
            <ListViewItemDescription>Developer</ListViewItemDescription>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('supports selection modes', () => {
    render(
      <ListView selectionMode='multiple'>
        <ListViewItem>
          <ListViewItemContent>
            <ListViewItemTitle>Selectable Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    const listbox = screen.getByRole('grid');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <ListView size='compact'>
        <ListViewItem>
          <ListViewItemContent>
            <ListViewItemTitle>Compact Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    const list = screen.getByRole('grid');
    expect(list).toHaveClass('group/listView');

    rerender(
      <ListView size='cozy'>
        <ListViewItem>
          <ListViewItemContent>
            <ListViewItemTitle>Cozy Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    expect(list).toHaveClass('group/listView');
  });

  it('supports disabled items', () => {
    render(
      <ListView>
        <ListViewItem key='disabled-item' isDisabled>
          <ListViewItemContent>
            <ListViewItemTitle>Disabled Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    const item = screen.getByRole('row');
    console.log(item);
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders additional content as children', () => {
    render(
      <ListView>
        <ListViewItem>
          <Icon data-testid='prefix-icon'>
            <Placeholder />
          </Icon>
          <ListViewItemContent>
            <ListViewItemTitle>Item with Icons</ListViewItemTitle>
          </ListViewItemContent>
          <Icon data-testid='suffix-icon'>
            <Placeholder />
          </Icon>
        </ListViewItem>
      </ListView>,
    );

    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
  });
});

describe('ListViewItem components', () => {
  it('renders item title with proper text content', () => {
    render(<ListViewItemTitle>Test Title</ListViewItemTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders item description with proper text content', () => {
    render(<ListViewItemDescription>Test Description</ListViewItemDescription>);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders item content container', () => {
    render(
      <ListViewItemContent>
        <span>Content inside container</span>
      </ListViewItemContent>,
    );
    expect(screen.getByText('Content inside container')).toBeInTheDocument();
  });
});

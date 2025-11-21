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

import { User } from '@accelint/icons';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuItem } from '../menu/item';
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
            <User />
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
      <ListView size='small'>
        <ListViewItem>
          <ListViewItemContent>
            <ListViewItemTitle>Small Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    const list = screen.getByRole('grid');
    expect(list).toHaveAttribute('data-size', 'small');

    rerender(
      <ListView size='large'>
        <ListViewItem>
          <ListViewItemContent>
            <ListViewItemTitle>Large Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    expect(list).toHaveAttribute('data-size', 'large');
  });

  it('supports disabled items', () => {
    render(
      <ListView disabledKeys={['disabled-item']}>
        <ListViewItem key='disabled-item'>
          <ListViewItemContent>
            <ListViewItemTitle>Disabled Item</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    const item = screen.getByRole('gridcell');
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders menu actions when provided', () => {
    const menu = (
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    );

    render(
      <ListView>
        <ListViewItem menu={menu}>
          <ListViewItemContent>
            <ListViewItemTitle>Item with Menu</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders additional icons when provided', () => {
    render(
      <ListView>
        <ListViewItem
          additionalIcons={[
            <Icon key='test-icon' data-testid='additional-icon'>
              <User />
            </Icon>,
          ]}
        >
          <ListViewItemContent>
            <ListViewItemTitle>Item with Additional Icons</ListViewItemTitle>
          </ListViewItemContent>
        </ListViewItem>
      </ListView>,
    );

    expect(screen.getByTestId('additional-icon')).toBeInTheDocument();
  });
});

describe('ListViewItem components', () => {
  it('renders item name with proper text content', () => {
    render(<ListViewItemTitle>Test Name</ListViewItemTitle>);
    expect(screen.getByText('Test Name')).toBeInTheDocument();
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

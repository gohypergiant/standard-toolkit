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
import { List } from '.';
import { useListItemVariant } from './context';
import { ListItem } from './item';
import { ListItemContent } from './item-content';
import { ListItemDescription } from './item-description';
import { ListItemTitle } from './item-title';

describe('List', () => {
  it('renders basic list items', () => {
    render(
      <List aria-label='user list'>
        <ListItem>
          <Icon>
            <Placeholder />
          </Icon>
          <ListItemContent>
            <ListItemTitle>John Doe</ListItemTitle>
            <ListItemDescription>Developer</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('supports selection modes', () => {
    render(
      <List selectionMode='multiple' aria-label='selectable list'>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Selectable Item</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    const listbox = screen.getByRole('grid');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <List variant='compact' aria-label='compact list'>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Compact Item</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    const list = screen.getByRole('grid');
    expect(list).toHaveClass('group/list');

    rerender(
      <List variant='cozy' aria-label='cozy list'>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Cozy Item</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    expect(list).toHaveClass('group/list');
  });

  it('supports disabled items', () => {
    render(
      <List aria-label='list with disabled items'>
        <ListItem key='disabled-item' isDisabled>
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    const item = screen.getByRole('row');
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders additional content as children', () => {
    render(
      <List aria-label='list with icons'>
        <ListItem>
          <Icon data-testid='prefix-icon'>
            <Placeholder />
          </Icon>
          <ListItemContent>
            <ListItemTitle>Item with Icons</ListItemTitle>
          </ListItemContent>
          <Icon data-testid='suffix-icon'>
            <Placeholder />
          </Icon>
        </ListItem>
      </List>,
    );

    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
  });
});

describe('ListItem components', () => {
  it('renders item title with proper text content', () => {
    render(<ListItemTitle>Test Title</ListItemTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders item description with proper text content', () => {
    render(<ListItemDescription>Test Description</ListItemDescription>);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders item content container', () => {
    render(
      <ListItemContent>
        <span>Content inside container</span>
      </ListItemContent>,
    );
    expect(screen.getByText('Content inside container')).toBeInTheDocument();
  });
});

describe('useListItemVariant hook', () => {
  it('returns default variant "cozy" when used outside of List context', () => {
    const TestComponent = () => {
      const variant = useListItemVariant();
      return <div data-testid='variant'>{variant}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByTestId('variant')).toHaveTextContent('cozy');
  });

  it('returns "cozy" variant from List context', () => {
    const TestComponent = () => {
      const variant = useListItemVariant();
      return <div data-testid='variant'>{variant}</div>;
    };

    render(
      <List variant='cozy' aria-label='test list'>
        <ListItem>
          <ListItemContent>
            <TestComponent />
          </ListItemContent>
        </ListItem>
      </List>,
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('cozy');
  });

  it('returns "compact" variant from List context', () => {
    const TestComponent = () => {
      const variant = useListItemVariant();
      return <div data-testid='variant'>{variant}</div>;
    };

    render(
      <List variant='compact' aria-label='test list'>
        <ListItem>
          <ListItemContent>
            <TestComponent />
          </ListItemContent>
        </ListItem>
      </List>,
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('compact');
  });
});

describe('Variant styling propagation', () => {
  it('propagates cozy variant to Icon components via IconProvider', () => {
    render(
      <List variant='cozy' aria-label='test list'>
        <ListItem>
          <Icon>
            <Placeholder data-testid='icon-child' />
          </Icon>
          <ListItemContent>
            <ListItemTitle>Test Title</ListItemTitle>
            <ListItemDescription>Test Description</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    const iconElement = screen.getByTestId('icon-child').parentElement;
    // IconProvider sets large size for cozy variant
    expect(iconElement).toHaveAttribute('data-size', 'large');
  });

  it('propagates compact variant to Icon components via IconProvider', () => {
    render(
      <List variant='compact' aria-label='test list'>
        <ListItem>
          <Icon>
            <Placeholder data-testid='icon-child' />
          </Icon>
          <ListItemContent>
            <ListItemTitle>Test Title</ListItemTitle>
            <ListItemDescription>Test Description</ListItemDescription>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    const iconElement = screen.getByTestId('icon-child').parentElement;
    // IconProvider sets small size for compact variant
    expect(iconElement).toHaveAttribute('data-size', 'small');
  });

  it('applies variant styling to multiple list items', () => {
    render(
      <List variant='compact' aria-label='test list'>
        <ListItem>
          <Icon>
            <Placeholder data-testid='icon-1' />
          </Icon>
          <ListItemContent>
            <ListItemTitle>Item 1</ListItemTitle>
          </ListItemContent>
        </ListItem>
        <ListItem>
          <Icon>
            <Placeholder data-testid='icon-2' />
          </Icon>
          <ListItemContent>
            <ListItemTitle>Item 2</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </List>,
    );

    const icon1 = screen.getByTestId('icon-1').parentElement;
    const icon2 = screen.getByTestId('icon-2').parentElement;

    // Both items should have compact (small) icon size from IconProvider
    expect(icon1).toHaveAttribute('data-size', 'small');
    expect(icon2).toHaveAttribute('data-size', 'small');
  });
});

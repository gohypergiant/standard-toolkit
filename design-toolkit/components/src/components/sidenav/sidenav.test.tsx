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

import { uuid } from '@accelint/core';
import { Placeholder } from '@accelint/icons';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Heading, Text } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { Sidenav } from './';
import type { ReactNode } from 'react';
import type { SidenavProps } from './types';

const id = uuid();

function setup(
  {
    children = (
      <>
        <Sidenav.Header>
          <Sidenav.Avatar>
            <Icon data-testid='logo'>
              <Placeholder />
            </Icon>
            <Heading>Application Header</Heading>
            <Text>subheader</Text>
          </Sidenav.Avatar>
        </Sidenav.Header>
        <Sidenav.Content>
          <Heading>Title</Heading>
          <Sidenav.Item>
            <Icon>
              <Placeholder />
            </Icon>
            <Text>Nav item</Text>
          </Sidenav.Item>
          <Divider />
          <Heading>External</Heading>
          <Sidenav.Link href='#' textValue='Link item'>
            <Icon>
              <Placeholder />
            </Icon>
            <Text>Link item</Text>
          </Sidenav.Link>
          <Divider />
          <Heading>Menu</Heading>
          <Sidenav.Menu
            data-testid='menu'
            icon={
              <Icon>
                <Placeholder />
              </Icon>
            }
            title='Settings'
          >
            <Sidenav.Menu.Item>
              <Text>Menu Item</Text>
            </Sidenav.Menu.Item>
            <Sidenav.Menu.Item>
              <Text>Menu Item 2</Text>
            </Sidenav.Menu.Item>
          </Sidenav.Menu>
        </Sidenav.Content>
        <Sidenav.Footer>
          <Sidenav.Avatar>
            <Icon data-testid='avatar'>
              <Placeholder />
            </Icon>
            <Heading>FullName</Heading>
            <Text>test@example.com</Text>
          </Sidenav.Avatar>
        </Sidenav.Footer>
      </>
    ),
    ...rest
  }: Partial<SidenavProps> = {},
  outside: ReactNode = (
    <Sidenav.Trigger for={id}>
      <Button>Open</Button>
    </Sidenav.Trigger>
  ),
) {
  return {
    ...render(
      <>
        <Sidenav {...rest} id={id} data-testid='nav'>
          {children}
        </Sidenav>
        {outside}
      </>,
    ),
    ...rest,
    children,
  };
}

describe('Sidenav', () => {
  it('should not render expanded content', async () => {
    setup();

    expect(screen.queryByText('Application Header')).toHaveClass(/hidden/);
    expect(screen.queryByText('subheader')).toHaveClass(/hidden/);
    expect(screen.queryByText('Title')).toHaveClass(/hidden/);
    expect(screen.queryByText('Nav item')).toHaveClass(/hidden/);
    expect(screen.queryByText('External')).toHaveClass(/hidden/);
    expect(screen.queryByText('Link item')).toHaveClass(/hidden/);
    expect(screen.queryByTestId('menu')).toBeInTheDocument();
    expect(screen.queryByText('FullName')).toHaveClass(/hidden/);
    expect(screen.queryByText('test@example.com')).toHaveClass(/hidden/);

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    expect(screen.queryByText('Menu Item 2')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('menu'));
    expect(screen.queryByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('Menu Item')).toBeInTheDocument();
    expect(screen.queryByText('Menu Item 2')).toBeInTheDocument();
  });

  it('should open externally', async () => {
    setup();

    await userEvent.click(screen.getByText('Open'));

    expect(screen.getByTestId('nav')).toHaveAttribute('data-open', 'true');
  });

  it('should close externally', async () => {
    setup();

    await userEvent.click(screen.getByText('Open'));

    expect(screen.getByTestId('nav')).toHaveAttribute('data-open', 'true');

    await userEvent.click(screen.getByText('Open'));

    expect(screen.getByTestId('nav')).not.toHaveAttribute('data-open');
  });

  it('should open internally', async () => {
    setup();

    await userEvent.click(screen.getByTestId('logo'));

    expect(screen.getByTestId('nav')).toHaveAttribute('data-open', 'true');
  });

  it('should close internally', async () => {
    setup();

    await userEvent.click(screen.getByTestId('logo'));

    expect(screen.getByTestId('nav')).toHaveAttribute('data-open', 'true');

    await userEvent.click(screen.getByTestId('logo'));

    expect(screen.getByTestId('nav')).not.toHaveAttribute('data-open');
  });
});

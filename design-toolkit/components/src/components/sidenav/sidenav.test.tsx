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
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { Heading, Text } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { Icon } from '../icon';
import { Sidenav } from './';
import type { SidenavProps } from './types';

function setup(
  {
    children = (
      <>
        <Sidenav.Header>
          <Icon size='large' data-testid='logo'>
            <Placeholder />
          </Icon>
          <div>
            <Heading>Application Header</Heading>
            <Heading>subheader</Heading>
          </div>
        </Sidenav.Header>

        <Heading>Title</Heading>
        <Sidenav.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Text>Nav item</Text>
        </Sidenav.Item>
      </>
    ),
    ...rest
  }: Partial<SidenavProps> = {},
  outside: ReactNode = (
    <Sidenav.Trigger>
      <Button>Open</Button>
    </Sidenav.Trigger>
  ),
) {
  return {
    ...render(
      <>
        <Sidenav {...rest} data-testid='nav'>
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
  it('should not render expanded content', () => {
    setup();

    expect(screen.queryByText('Application Header')).toHaveClass(/hidden/);
    expect(screen.queryByText('subheader')).toHaveClass(/hidden/);
    expect(screen.queryByText('Title')).toHaveClass(/hidden/);
    expect(screen.queryByText('Nav item')).toHaveClass(/hidden/);
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

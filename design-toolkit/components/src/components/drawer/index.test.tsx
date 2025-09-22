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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { Drawer } from './';
import type { ReactNode } from 'react';
import type { DrawerProps } from './types';

const ids = {
  drawer: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};
const alternate = (
  <>
    <Drawer.Menu>
      <Drawer.Menu.Item for={ids.a} textValue='Menu A'>
        A
      </Drawer.Menu.Item>
      <Drawer.Menu.Item for={ids.c} textValue='Menu C'>
        C
      </Drawer.Menu.Item>
      <Drawer.Menu.Item for={ids.b} textValue='Menu B'>
        B
      </Drawer.Menu.Item>
    </Drawer.Menu>
    <Drawer.Panel>
      <Drawer.View id={ids.a}>
        <Drawer.Header>
          <Drawer.Header.Title>Title A</Drawer.Header.Title>
        </Drawer.Header>
        <Drawer.Content>Content A</Drawer.Content>
        <Drawer.Footer>Footer A</Drawer.Footer>
      </Drawer.View>
      <Drawer.View id={ids.b}>
        <Drawer.Header>
          <Drawer.Header.Title>Title B</Drawer.Header.Title>
        </Drawer.Header>
        <Drawer.Content>Content B</Drawer.Content>
        <Drawer.Footer>Footer B</Drawer.Footer>
      </Drawer.View>
      <Drawer.View id={ids.c}>
        <Drawer.Header>
          <Drawer.Header.Title>Title C</Drawer.Header.Title>
        </Drawer.Header>
        <Drawer.Content>Content C</Drawer.Content>
        <Drawer.Footer>Footer C</Drawer.Footer>
      </Drawer.View>
    </Drawer.Panel>
  </>
);

function setup(
  {
    id = ids.drawer,
    children = (
      <>
        <Drawer.Menu>
          <Drawer.Menu.Item for={ids.a} textValue='Menu A'>
            A
          </Drawer.Menu.Item>
          <Drawer.Menu.Item for={ids.b} textValue='Menu B'>
            B
          </Drawer.Menu.Item>
          <Drawer.Menu.Item for={ids.c} textValue='Menu C'>
            C
          </Drawer.Menu.Item>
        </Drawer.Menu>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.Header.Title>Title</Drawer.Header.Title>
            <Drawer.Trigger for='close'>
              <Button>Close</Button>
            </Drawer.Trigger>
          </Drawer.Header>
          <Drawer.Content>
            <Drawer.View id={ids.a}>View A</Drawer.View>
            <Drawer.View id={ids.b}>View B</Drawer.View>
            <Drawer.View id={ids.c}>View C</Drawer.View>
          </Drawer.Content>
          <Drawer.Footer>Footer</Drawer.Footer>
        </Drawer.Panel>
      </>
    ),
    ...rest
  }: Partial<DrawerProps> = {},
  outside: ReactNode = (
    <Drawer.Trigger for={`open:${ids.a}`}>
      <Button>Open A</Button>
    </Drawer.Trigger>
  ),
) {
  return {
    ...render(
      <>
        <Drawer {...rest} id={id}>
          {children}
        </Drawer>
        {outside}
      </>,
    ),
    ...rest,
    id,
    children,
  };
}

describe('Drawer', () => {
  it('should not render content', () => {
    setup();

    expect(screen.queryByText('View A')).not.toBeInTheDocument();
    expect(screen.queryByText('View B')).not.toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();
  });

  it('should not render content: alternate', () => {
    setup({ children: alternate });

    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    expect(screen.queryByText('Content B')).not.toBeInTheDocument();
    expect(screen.queryByText('Content C')).not.toBeInTheDocument();
  });

  it('should render default view', () => {
    const { container } = setup({ defaultView: ids.a });

    expect(screen.getByText('View A')).toBeInTheDocument();
    expect(screen.queryByText('View B')).not.toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();
    expect(screen.getByText('A').parentElement).toHaveAttribute(
      'data-selected',
    );
    expect(container.firstChild).toHaveAttribute('data-open');
  });

  it('should render default view: alternate', () => {
    const { container } = setup({ children: alternate, defaultView: ids.a });

    expect(screen.getByText('Title A')).toBeInTheDocument();
    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.getByText('Footer A')).toBeInTheDocument();
    expect(screen.queryByText('Title B')).not.toBeInTheDocument();
    expect(screen.queryByText('Content B')).not.toBeInTheDocument();
    expect(screen.queryByText('Footer B')).not.toBeInTheDocument();
    expect(screen.queryByText('Title C')).not.toBeInTheDocument();
    expect(screen.queryByText('Content C')).not.toBeInTheDocument();
    expect(screen.queryByText('Footer C')).not.toBeInTheDocument();
    expect(screen.getByText('A').parentElement).toHaveAttribute(
      'data-selected',
    );
    expect(container.firstChild).toHaveAttribute('data-open');
  });

  it('should be externally openable', async () => {
    const { container } = setup();

    await userEvent.click(screen.getByText('Open A'));

    expect(screen.getByText('View A')).toBeInTheDocument();
    expect(screen.queryByText('View B')).not.toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();
    expect(screen.getByText('A').parentElement).toHaveAttribute(
      'data-selected',
    );
    expect(container.firstChild).toHaveAttribute('data-open');
  });

  it('should navigate via menu item', async () => {
    setup({ defaultView: ids.a });

    expect(screen.getByText('View A')).toBeInTheDocument();
    expect(screen.queryByText('View B')).not.toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('B'));

    expect(screen.queryByText('View A')).not.toBeInTheDocument();
    expect(screen.getByText('View B')).toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();
  });

  it('should close', async () => {
    const { container } = setup({ defaultView: ids.a });

    expect(screen.getByText('View A')).toBeInTheDocument();
    expect(screen.queryByText('View B')).not.toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Close'));

    expect(screen.queryByText('View A')).not.toBeInTheDocument();
    expect(screen.queryByText('View B')).not.toBeInTheDocument();
    expect(screen.queryByText('View C')).not.toBeInTheDocument();

    expect(container.firstChild).not.toHaveAttribute('data-open');
  });
});

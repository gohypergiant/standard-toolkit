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
import { DrawerContent } from './content';
import { DrawerFooter } from './footer';
import { DrawerHeader } from './header';
import { DrawerHeaderTitle } from './header-title';
import { DrawerMenu } from './menu';
import { DrawerMenuItem } from './menu-item';
import { DrawerPanel } from './panel';
import { DrawerTrigger } from './trigger';
import { DrawerView } from './view';
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
    <DrawerMenu>
      <DrawerMenuItem for={ids.a} textValue='Menu A'>
        A
      </DrawerMenuItem>
      <DrawerMenuItem for={ids.c} textValue='Menu C'>
        C
      </DrawerMenuItem>
      <DrawerMenuItem for={ids.b} textValue='Menu B'>
        B
      </DrawerMenuItem>
    </DrawerMenu>
    <DrawerPanel>
      <DrawerView id={ids.a}>
        <DrawerHeader>
          <DrawerHeaderTitle>Title A</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerContent>Content A</DrawerContent>
        <DrawerFooter>Footer A</DrawerFooter>
      </DrawerView>
      <DrawerView id={ids.b}>
        <DrawerHeader>
          <DrawerHeaderTitle>Title B</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerContent>Content B</DrawerContent>
        <DrawerFooter>Footer B</DrawerFooter>
      </DrawerView>
      <DrawerView id={ids.c}>
        <DrawerHeader>
          <DrawerHeaderTitle>Title C</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerContent>Content C</DrawerContent>
        <DrawerFooter>Footer C</DrawerFooter>
      </DrawerView>
    </DrawerPanel>
  </>
);

function setup(
  {
    id = ids.drawer,
    children = (
      <>
        <DrawerMenu>
          <DrawerMenuItem for={ids.a} textValue='Menu A'>
            A
          </DrawerMenuItem>
          <DrawerMenuItem for={ids.b} textValue='Menu B'>
            B
          </DrawerMenuItem>
          <DrawerMenuItem for={ids.c} textValue='Menu C'>
            C
          </DrawerMenuItem>
        </DrawerMenu>
        <DrawerPanel>
          <DrawerHeader>
            <DrawerHeaderTitle>Title</DrawerHeaderTitle>
            <DrawerTrigger for='close'>
              <Button>Close</Button>
            </DrawerTrigger>
          </DrawerHeader>
          <DrawerContent>
            <DrawerView id={ids.a}>View A</DrawerView>
            <DrawerView id={ids.b}>View B</DrawerView>
            <DrawerView id={ids.c}>View C</DrawerView>
          </DrawerContent>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerPanel>
      </>
    ),
    ...rest
  }: Partial<DrawerProps> = {},
  outside: ReactNode = (
    <DrawerTrigger for={`open:${ids.a}`}>
      <Button>Open A</Button>
    </DrawerTrigger>
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

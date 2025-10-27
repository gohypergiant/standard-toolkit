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

import Kebab from '@accelint/icons/kebab';
import Placeholder from '@accelint/icons/placeholder';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from './menu';
import { MenuDescription } from './menu-description';
import { MenuItem } from './menu-item';
import { MenuLabel } from './menu-label';
import { MenuSection } from './menu-section';
import { MenuSeparator } from './menu-separator';
import { MenuSubmenu } from './menu-submenu';
import { MenuTrigger } from './menu-trigger';
import type { MenuProps } from './types';

function setup({
  children = (
    <>
      <MenuItem>
        <Icon>
          <Placeholder />
        </Icon>
        <MenuLabel>Songbirds</MenuLabel>
      </MenuItem>
      <MenuSeparator />
      <MenuSubmenu>
        <MenuItem>
          <MenuLabel>North American Birds</MenuLabel>
        </MenuItem>
        <Menu>
          <MenuItem>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuLabel>Blue Jay</MenuLabel>
            <MenuDescription>Cyanocitta cristata</MenuDescription>
          </MenuItem>
          <MenuItem isDisabled>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuLabel>Gray catbird</MenuLabel>
            <MenuDescription>Dumetella carolinensis</MenuDescription>
          </MenuItem>
        </Menu>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuSection title='Additional Notable Species'>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuLabel>Mallard</MenuLabel>
          <MenuDescription>Anas platyrhynchos</MenuDescription>
        </MenuItem>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuLabel>Chimney swift</MenuLabel>
          <MenuDescription>Chaetura pelagica</MenuDescription>
        </MenuItem>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuLabel>Brünnich's guillemot</MenuLabel>
          <MenuDescription>Dumetella carolinensis</MenuDescription>
        </MenuItem>
      </MenuSection>
    </>
  ),
  ...rest
}: Partial<MenuProps<object>> = {}) {
  render(
    <MenuTrigger>
      <Button variant='icon' aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </Button>
      <Menu {...rest}>{children}</Menu>
    </MenuTrigger>,
  );

  return {
    ...rest,
    children,
  };
}

describe('Menu', () => {
  it('should render', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

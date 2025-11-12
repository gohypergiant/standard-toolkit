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
import { Menu } from './';
import { MenuItem } from './item';
import { MenuItemDescription } from './item-description';
import { MenuItemLabel } from './item-label';
import { MenuSection } from './section';
import { MenuSeparator } from './separator';
import { MenuSubmenu } from './submenu';
import { MenuTrigger } from './trigger';
import type { MenuProps } from './types';

function setup({
  children = (
    <>
      <MenuItem>
        <Icon>
          <Placeholder />
        </Icon>
        <MenuItemLabel>Songbirds</MenuItemLabel>
      </MenuItem>
      <MenuSeparator />
      <MenuSubmenu>
        <MenuItem>
          <MenuItemLabel>North American Birds</MenuItemLabel>
        </MenuItem>
        <Menu>
          <MenuItem>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Blue Jay</MenuItemLabel>
            <MenuItemDescription>Cyanocitta cristata</MenuItemDescription>
          </MenuItem>
          <MenuItem isDisabled>
            <Icon>
              <Placeholder />
            </Icon>
            <MenuItemLabel>Gray catbird</MenuItemLabel>
            <MenuItemDescription>Dumetella carolinensis</MenuItemDescription>
          </MenuItem>
        </Menu>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuSection title='Additional Notable Species'>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Mallard</MenuItemLabel>
          <MenuItemDescription>Anas platyrhynchos</MenuItemDescription>
        </MenuItem>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Chimney swift</MenuItemLabel>
          <MenuItemDescription>Chaetura pelagica</MenuItemDescription>
        </MenuItem>
        <MenuItem>
          <Icon>
            <Placeholder />
          </Icon>
          <MenuItemLabel>Brünnich's guillemot</MenuItemLabel>
          <MenuItemDescription>Dumetella carolinensis</MenuItemDescription>
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

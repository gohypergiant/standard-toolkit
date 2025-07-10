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
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Menu } from './index';
import type { MenuProps } from './types';

function setup({
  children = (
    <>
      <Menu.Item>
        <Menu.Item.Icon>
          <Placeholder />
        </Menu.Item.Icon>
        <Menu.Item.Label>Songbirds</Menu.Item.Label>
      </Menu.Item>
      <Menu.Separator />
      <Menu.Submenu>
        <Menu.Item>
          <Menu.Item.Label>North American Birds</Menu.Item.Label>
        </Menu.Item>
        <Menu>
          <Menu.Item>
            <Menu.Item.Icon>
              <Placeholder />
            </Menu.Item.Icon>
            <Menu.Item.Label>Blue Jay</Menu.Item.Label>
            <Menu.Item.Description>Cyanocitta cristata</Menu.Item.Description>
          </Menu.Item>
          <Menu.Item isDisabled>
            <Menu.Item.Icon>
              <Placeholder />
            </Menu.Item.Icon>
            <Menu.Item.Label>Gray catbird</Menu.Item.Label>
            <Menu.Item.Description>
              Dumetella carolinensis
            </Menu.Item.Description>
          </Menu.Item>
        </Menu>
      </Menu.Submenu>
      <Menu.Separator />
      <Menu.Section header='Additional Notable Species'>
        <Menu.Item>
          <Menu.Item.Icon>
            <Placeholder />
          </Menu.Item.Icon>
          <Menu.Item.Label>Mallard</Menu.Item.Label>
          <Menu.Item.Description>Anas platyrhynchos</Menu.Item.Description>
        </Menu.Item>
        <Menu.Item>
          <Menu.Item.Icon>
            <Placeholder />
          </Menu.Item.Icon>
          <Menu.Item.Label>Chimney swift</Menu.Item.Label>
          <Menu.Item.Description>Chaetura pelagica</Menu.Item.Description>
        </Menu.Item>
        <Menu.Item>
          <Menu.Item.Icon>
            <Placeholder />
          </Menu.Item.Icon>
          <Menu.Item.Label>Brünnich's guillemot</Menu.Item.Label>
          <Menu.Item.Description>Dumetella carolinensis</Menu.Item.Description>
        </Menu.Item>
      </Menu.Section>
    </>
  ),
  ...rest
}: Partial<MenuProps<object>> = {}) {
  render(
    <Menu.Trigger>
      <IconButton aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </IconButton>
      <Menu {...rest}>{children}</Menu>
    </Menu.Trigger>,
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

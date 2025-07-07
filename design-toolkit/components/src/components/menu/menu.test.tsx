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
        <Menu.Icon>
          <Placeholder />
        </Menu.Icon>
        <Menu.Label>Songbirds</Menu.Label>
      </Menu.Item>
      <Menu.Separator />
      <Menu.Submenu>
        <Menu.Item>
          <Menu.Label>North American Birds</Menu.Label>
        </Menu.Item>
        <Menu>
          <Menu.Item>
            <Menu.Icon>
              <Placeholder />
            </Menu.Icon>
            <Menu.Label>Blue Jay</Menu.Label>
            <Menu.Description>Cyanocitta cristata</Menu.Description>
          </Menu.Item>
          <Menu.Item isDisabled>
            <Menu.Icon>
              <Placeholder />
            </Menu.Icon>
            <Menu.Label>Gray catbird</Menu.Label>
            <Menu.Description>Dumetella carolinensis</Menu.Description>
          </Menu.Item>
        </Menu>
      </Menu.Submenu>
      <Menu.Separator />
      <Menu.Section header='Additional Notable Species'>
        <Menu.Item>
          <Menu.Icon>
            <Placeholder />
          </Menu.Icon>
          <Menu.Label>Mallard</Menu.Label>
          <Menu.Description>Anas platyrhynchos</Menu.Description>
        </Menu.Item>
        <Menu.Item>
          <Menu.Icon>
            <Placeholder />
          </Menu.Icon>
          <Menu.Label>Chimney swift</Menu.Label>
          <Menu.Description>Chaetura pelagica</Menu.Description>
        </Menu.Item>
        <Menu.Item>
          <Menu.Icon>
            <Placeholder />
          </Menu.Icon>
          <Menu.Label>Brünnich's guillemot</Menu.Label>
          <Menu.Description>Dumetella carolinensis</Menu.Description>
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

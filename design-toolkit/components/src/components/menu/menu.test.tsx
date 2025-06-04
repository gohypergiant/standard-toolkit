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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Menu, MenuItem, type MenuProps, MenuSection } from './index';

function setup({
  children = 'Menu Item',
  ...rest
}: Partial<MenuProps<object>> = {}) {
  render(
    <Menu {...rest}>
      <MenuItem>{children}</MenuItem>
    </Menu>,
  );

  return {
    ...rest,
    children,
  };
}

describe('Menu', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('should render with menu section', () => {
    render(
      <Menu>
        <MenuSection title='Section'>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
        </MenuSection>
      </Menu>,
    );

    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});

/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import Placeholder from '@accelint/icons/placeholder';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MenuItem } from '../menu/item';
import { MenuItemLabel } from '../menu/item-label';
import { MenuSection } from '../menu/section';
import { MenuSeparator } from '../menu/separator';
import { MenuButton } from './';
import type { MenuButtonProps } from './types';

function setup(props: Partial<MenuButtonProps> = {}) {
  const defaultProps: MenuButtonProps = {
    label: 'Actions',
    children: (
      <>
        <MenuItem id='edit'>
          <MenuItemLabel>Edit</MenuItemLabel>
        </MenuItem>
        <MenuItem id='copy'>
          <MenuItemLabel>Copy</MenuItemLabel>
        </MenuItem>
        <MenuItem id='delete'>
          <MenuItemLabel>Delete</MenuItemLabel>
        </MenuItem>
      </>
    ),
    ...props,
  };

  render(<MenuButton {...defaultProps} />);

  return defaultProps;
}

describe('MenuButton', () => {
  describe('Basic Rendering', () => {
    it('should render with label', () => {
      setup({ label: 'Actions' });

      expect(
        screen.getByRole('button', { name: /actions/i }),
      ).toBeInTheDocument();
    });

    it('should render chevron icon', () => {
      setup({ label: 'Actions' });

      // ChevronDown icon should be present in the button
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('should open menu when clicked', async () => {
      const user = userEvent.setup();
      setup();

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should display menu items when open', async () => {
      const user = userEvent.setup();
      setup();

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('should render with icon when provided', () => {
      setup({
        label: 'Create',
        icon: <Placeholder data-testid='prefix-icon' />,
      });

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    });

    it('should render icon-only mode when variant is icon and no label', () => {
      setup({
        label: undefined,
        variant: 'icon',
        'aria-label': 'More options',
      });

      const button = screen.getByRole('button', { name: /more options/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Button Variants', () => {
    it.each([
      'filled',
      'flat',
      'outline',
    ] as const)('should render with variant=%s', (variant) => {
      setup({ label: 'Actions', variant });

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Button Sizes', () => {
    it.each([
      'large',
      'medium',
      'small',
      'xsmall',
    ] as const)('should render with size=%s', (size) => {
      setup({ label: 'Actions', size });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', size);
    });
  });

  describe('Button Colors', () => {
    it.each([
      'mono-muted',
      'mono-bold',
      'accent',
      'serious',
      'critical',
    ] as const)('should render with color=%s', (color) => {
      setup({ label: 'Actions', color });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-color', color);
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when isDisabled is true', () => {
      setup({ label: 'Actions', isDisabled: true });

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not open menu when disabled', async () => {
      const user = userEvent.setup();
      setup({ label: 'Actions', isDisabled: true });

      await user.click(screen.getByRole('button'));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Menu Props', () => {
    it('should call onAction when menu item is clicked', async () => {
      const onAction = vi.fn();
      const user = userEvent.setup();
      setup({ onAction });

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Edit'));

      expect(onAction).toHaveBeenCalledWith('edit');
    });

    it('should support menu sections', async () => {
      const user = userEvent.setup();
      setup({
        children: (
          <>
            <MenuSection title='File'>
              <MenuItem id='new'>
                <MenuItemLabel>New</MenuItemLabel>
              </MenuItem>
            </MenuSection>
            <MenuSeparator />
            <MenuItem id='settings'>
              <MenuItemLabel>Settings</MenuItemLabel>
            </MenuItem>
          </>
        ),
      });

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open menu with Enter key', async () => {
      const user = userEvent.setup();
      setup();

      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should open menu with Space key', async () => {
      const user = userEvent.setup();
      setup();

      screen.getByRole('button').focus();
      await user.keyboard(' ');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should close menu with Escape key', async () => {
      const user = userEvent.setup();
      setup();

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Support', () => {
    it('should not render tooltip wrapper when tooltip prop is not provided', () => {
      setup({ tooltip: undefined });

      // Button should render directly without tooltip wrapper
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // No tooltip element in the DOM
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should render button correctly when tooltip prop is provided', () => {
      setup({ tooltip: 'More options' });

      // Button should still be accessible
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should hide tooltip when menu is open', async () => {
      const user = userEvent.setup();
      setup({ tooltip: 'More options' });

      // Click to open menu
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Tooltip should not be visible when menu is open
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});

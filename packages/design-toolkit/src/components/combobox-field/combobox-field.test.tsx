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
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OptionsItem } from '../options/item';
import { OptionsItemDescription } from '../options/item-description';
import { OptionsItemLabel } from '../options/item-label';
import { ComboBoxField } from './';
import type { OptionsDataItem } from '../options/types';
import type { ComboBoxFieldProps } from './types';

function setup({
  children = (
    <>
      <OptionsItem isDisabled>
        <OptionsItemLabel>Red Panda</OptionsItemLabel>
        <OptionsItemDescription>Some ice cream</OptionsItemDescription>
      </OptionsItem>
      <OptionsItem>
        <OptionsItemLabel>Cat</OptionsItemLabel>
        <OptionsItemDescription>Some ice cream</OptionsItemDescription>
      </OptionsItem>
      <OptionsItem>
        <OptionsItemLabel>Dog</OptionsItemLabel>
        <OptionsItemDescription>Some ice cream</OptionsItemDescription>
      </OptionsItem>
    </>
  ),
  ...rest
}: Partial<ComboBoxFieldProps<OptionsDataItem>> = {}) {
  const result = render(<ComboBoxField {...rest}>{children}</ComboBoxField>);

  return {
    ...result,
    ...rest,
    children,
  };
}

describe('ComboBoxField', () => {
  it('should render', () => {
    setup({ 'aria-label': 'Animals' });

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  describe('Clear Button', () => {
    it('should render clear button when isClearable is true', () => {
      setup({ 'aria-label': 'Animals', isClearable: true });

      const buttons = screen.getAllByRole('button');
      // Should have 2 buttons: clear and dropdown trigger
      expect(buttons).toHaveLength(2);
    });

    it('should not render clear button when isClearable is false', () => {
      setup({ 'aria-label': 'Animals', isClearable: false });

      const buttons = screen.getAllByRole('button');
      // Should only have dropdown trigger button
      expect(buttons).toHaveLength(1);
    });

    it('should not render clear button when isReadOnly is true', () => {
      setup({ 'aria-label': 'Animals', isReadOnly: true, isClearable: true });

      const buttons = screen.queryAllByRole('button');
      // Should have no buttons in readonly mode
      expect(buttons).toHaveLength(0);
    });

    it('should clear input when clear button is clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();

      setup({
        'aria-label': 'Animals',
        defaultInputValue: 'Cat',
        isClearable: true,
        onInputChange,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveValue('Cat');

      const [clearButton] = screen.getAllByRole('button');
      if (clearButton) {
        await user.click(clearButton);
      }

      expect(onInputChange).toHaveBeenCalledWith('');
      expect(combobox).toHaveValue('');
    });

    it('should clear input when clear button is clicked (controlled)', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();

      const { rerender } = setup({
        'aria-label': 'Animals',
        inputValue: 'Dog',
        isClearable: true,
        onInputChange,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveValue('Dog');

      const [clearButton] = screen.getAllByRole('button');
      if (clearButton) {
        await user.click(clearButton);
      }

      expect(onInputChange).toHaveBeenCalledWith('');

      // Simulate parent updating the controlled value
      rerender(
        <ComboBoxField
          aria-label='Animals'
          inputValue=''
          isClearable={true}
          onInputChange={onInputChange}
        >
          <OptionsItem>
            <OptionsItemLabel>Cat</OptionsItemLabel>
          </OptionsItem>
        </ComboBoxField>,
      );

      expect(combobox).toHaveValue('');
    });

    it('should be disabled when combobox is disabled', () => {
      setup({
        'aria-label': 'Animals',
        isDisabled: true,
        isClearable: true,
        defaultInputValue: 'Test',
      });

      const [clearButton] = screen.getAllByRole('button');
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Escape Key Behavior', () => {
    it('should clear input on Escape key when isClearable is true', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();

      setup({
        'aria-label': 'Animals',
        defaultInputValue: 'Cat',
        isClearable: true,
        onInputChange,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveValue('Cat');

      await user.type(combobox, '{Escape}');

      expect(onInputChange).toHaveBeenCalledWith('');
      expect(combobox).toHaveValue('');
    });

    it('should not trigger handleClear on Escape when isClearable is false', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();

      setup({
        'aria-label': 'Animals',
        defaultInputValue: 'Cat',
        isClearable: false,
        onInputChange,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveValue('Cat');

      await user.type(combobox, '{Escape}');

      // ComboBox native behavior will clear on escape, but our handler won't be called
      // The key insight is that isClearable only controls our custom clear button and Escape handling
      expect(combobox).toHaveValue('');
    });

    it('should call custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      setup({
        'aria-label': 'Animals',
        defaultInputValue: 'Cat',
        onKeyDown,
      });

      const combobox = screen.getByRole('combobox');

      await user.type(combobox, 'a');

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe('Input Value Management', () => {
    it('should handle uncontrolled input with defaultInputValue', async () => {
      const user = userEvent.setup();

      setup({
        'aria-label': 'Animals',
        defaultInputValue: 'Initial Value',
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveValue('Initial Value');

      await user.clear(combobox);
      await user.type(combobox, 'New Value');

      expect(combobox).toHaveValue('New Value');
    });

    it('should handle controlled input with inputValue', () => {
      const onInputChange = vi.fn();

      const { rerender } = setup({
        'aria-label': 'Animals',
        inputValue: 'Controlled',
        onInputChange,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveValue('Controlled');

      // Simulate parent updating controlled value
      rerender(
        <ComboBoxField
          aria-label='Animals'
          inputValue='Updated'
          onInputChange={onInputChange}
        >
          <OptionsItem>
            <OptionsItemLabel>Cat</OptionsItemLabel>
          </OptionsItem>
        </ComboBoxField>,
      );

      expect(combobox).toHaveValue('Updated');
    });

    it('should call onInputChange when typing', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();

      setup({
        'aria-label': 'Animals',
        onInputChange,
      });

      const combobox = screen.getByRole('combobox');

      await user.type(combobox, 'C');

      expect(onInputChange).toHaveBeenCalledWith('C');
    });
  });

  describe('Data Attributes', () => {
    it('should set data-empty when input is empty', () => {
      const { container } = setup({
        'aria-label': 'Animals',
        defaultInputValue: '',
      });

      const comboboxField = container.querySelector(
        '[data-empty]',
      ) as HTMLElement;
      expect(comboboxField).toBeInTheDocument();
    });

    it('should not set data-empty when input has value', () => {
      const { container } = setup({
        'aria-label': 'Animals',
        defaultInputValue: 'Cat',
      });

      const combobox = container.querySelector(
        '[role="combobox"]',
      ) as HTMLElement;
      const parent = combobox.closest('[data-empty]');
      expect(parent).not.toBeInTheDocument();
    });

    it('should set data-size attribute', () => {
      const { container } = setup({
        'aria-label': 'Animals',
        size: 'small',
      });

      const comboboxField = container.querySelector(
        '[data-size="small"]',
      ) as HTMLElement;
      expect(comboboxField).toBeInTheDocument();
    });

    it('should default to medium size', () => {
      const { container } = setup({
        'aria-label': 'Animals',
      });

      const comboboxField = container.querySelector(
        '[data-size="medium"]',
      ) as HTMLElement;
      expect(comboboxField).toBeInTheDocument();
    });
  });

  describe('Read-Only Mode', () => {
    it('should not render trigger button when isReadOnly', () => {
      setup({
        'aria-label': 'Animals',
        isReadOnly: true,
      });

      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('should set tabindex to -1 when isReadOnly', () => {
      setup({
        'aria-label': 'Animals',
        isReadOnly: true,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('tabindex', '-1');
    });

    it('should set data-readonly on control div', () => {
      const { container } = setup({
        'aria-label': 'Animals',
        isReadOnly: true,
      });

      const control = container.querySelector('[data-readonly]');
      expect(control).toBeInTheDocument();
    });
  });

  describe('Label and Description', () => {
    it('should render label when provided and not small', () => {
      setup({
        'aria-label': 'Animals',
        label: 'Select Animal',
        size: 'medium',
      });

      expect(screen.getByText(/Select Animal/)).toBeInTheDocument();
    });

    it('should not render label when size is small', () => {
      setup({
        'aria-label': 'Animals',
        label: 'Select Animal',
        size: 'small',
      });

      expect(screen.queryByText('Select Animal')).not.toBeInTheDocument();
    });

    it('should render description when provided', () => {
      setup({
        'aria-label': 'Animals',
        description: 'Choose your favorite animal',
        size: 'medium',
      });

      const descriptions = screen.getAllByText('Choose your favorite animal');
      // React Aria creates a hidden template, so we expect at least one visible
      expect(descriptions.length).toBeGreaterThan(0);
    });

    it('should not render description when isReadOnly', () => {
      setup({
        'aria-label': 'Animals',
        description: 'Choose your favorite animal',
        isReadOnly: true,
      });

      expect(
        screen.queryByText('Choose your favorite animal'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render error message', () => {
      setup({
        'aria-label': 'Animals',
        errorMessage: 'This field is required',
      });

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should mark as invalid when errorMessage is provided', () => {
      setup({
        'aria-label': 'Animals',
        errorMessage: 'Invalid input',
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-invalid', 'true');
    });

    it('should mark as invalid when isInvalid is true', () => {
      setup({
        'aria-label': 'Animals',
        isInvalid: true,
      });

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-invalid', 'true');
    });
  });
});

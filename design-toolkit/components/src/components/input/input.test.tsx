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
import { Input } from './';
import type { InputProps } from './types';

function setup(props: Partial<InputProps> = {}) {
  return {
    ...render(<Input {...props} />),
    ...props,
  };
}

describe('Input', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should track value length', () => {
    const value = 'Foo';
    const { container } = setup({ value });

    expect(container.firstChild).toHaveAttribute(
      'data-length',
      `${value.length}`,
    );
  });

  it('should clear input on click of clear button', async () => {
    const user = userEvent.setup();

    setup({ isClearable: true });

    const input = screen.getByRole('textbox');
    const value = 'Foo';

    await user.type(input, value);

    expect(input).toHaveValue(value);

    await user.click(screen.getByRole('button'));

    expect(input).toHaveValue('');
  });

  it('should clear input on click of clear button when controlled', async () => {
    const user = userEvent.setup();
    const value = 'Foo';
    const { onChange } = setup({
      value: 'Foo',
      isClearable: true,
      onChange: vi.fn(),
    });

    expect(screen.getByRole('textbox')).toHaveValue(value);

    await user.click(screen.getByRole('button'));

    expect(onChange).toHaveBeenCalledWith({ target: { value: '' } });
  });

  it('should clear input on escape', async () => {
    const user = userEvent.setup();

    setup({ isClearable: true });

    const input = screen.getByRole('textbox');
    const value = 'Foo';

    await user.type(input, value);

    expect(input).toHaveValue(value);

    await user.type(input, '[Escape]');

    expect(input).toHaveValue('');
  });

  it('should clear input on escape when controlled', async () => {
    const user = userEvent.setup();
    const value = 'Foo';
    const { onChange } = setup({ value, isClearable: true, onChange: vi.fn() });

    const input = screen.getByRole('textbox');

    expect(screen.getByRole('textbox')).toHaveValue(value);

    await user.type(input, '[Escape]');

    expect(onChange).toHaveBeenCalledWith({ target: { value: '' } });
  });

  it('should default size', () => {
    const value = 'Foo';
    const { container } = setup({ value });

    expect(container.firstChild).toHaveAttribute('data-size', 'medium');
  });

  describe('prefix', () => {
    it('should render prefix when provided', () => {
      const prefix = '$';
      const { container } = setup({ prefix });

      const prefixElement = container.querySelector('span');
      expect(prefixElement).toBeInTheDocument();
      expect(prefixElement).toHaveTextContent(prefix);
    });

    it('should not render prefix when not provided', () => {
      const { container } = setup();

      const spans = container.querySelectorAll('span');
      expect(spans.length).toBe(0);
    });

    it('should render prefix with custom className', () => {
      const prefix = '€';
      const customClass = 'custom-prefix-class';
      const { container } = setup({
        prefix,
        classNames: { prefix: customClass },
      });

      const prefixElement = container.querySelector('span');
      expect(prefixElement).toHaveClass(customClass);
    });
  });

  describe('suffix', () => {
    it('should render suffix when provided', () => {
      const suffix = 'kg';
      const { container } = setup({ suffix });

      const suffixElement = container.querySelector('span');
      expect(suffixElement).toBeInTheDocument();
      expect(suffixElement).toHaveTextContent(suffix);
    });

    it('should not render suffix when not provided', () => {
      const { container } = setup();

      const spans = container.querySelectorAll('span');
      expect(spans.length).toBe(0);
    });

    it('should render suffix with custom className', () => {
      const suffix = '%';
      const customClass = 'custom-suffix-class';
      const { container } = setup({
        suffix,
        classNames: { suffix: customClass },
      });

      const suffixElement = container.querySelector('span');
      expect(suffixElement).toHaveClass(customClass);
    });
  });

  describe('prefix and suffix together', () => {
    it('should render both prefix and suffix when provided', () => {
      const prefix = '~';
      const suffix = '°C';
      const { container } = setup({ prefix, suffix });

      const spans = container.querySelectorAll('span');
      expect(spans.length).toBe(2);
      expect(spans[0]).toHaveTextContent(prefix);
      expect(spans[1]).toHaveTextContent(suffix);
    });

    it('should work with isClearable', async () => {
      const user = userEvent.setup();
      const prefix = '$';
      const suffix = 'USD';
      setup({ prefix, suffix, isClearable: true });

      const input = screen.getByRole('textbox');
      await user.type(input, '100');

      expect(input).toHaveValue('100');

      // Check that prefix and suffix text appears in the document
      expect(screen.getByText(prefix)).toBeInTheDocument();
      expect(screen.getByText(suffix)).toBeInTheDocument();

      await user.click(screen.getByRole('button'));
      expect(input).toHaveValue('');

      // Prefix and suffix should still be visible after clearing
      expect(screen.getByText(prefix)).toBeInTheDocument();
      expect(screen.getByText(suffix)).toBeInTheDocument();
    });
  });
});

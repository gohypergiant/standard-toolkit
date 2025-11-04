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
import { TextField } from './';
import type { TextFieldProps } from './types';

function setup(props: Partial<TextFieldProps> = {}) {
  return {
    ...render(<TextField {...props} />),
    ...props,
  };
}

describe('TextField', () => {
  it('should render', () => {
    setup({
      label: 'Label',
      inputProps: { placeholder: 'Placeholder' },
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Placeholder',
    );
  });

  it('should show error message when invalid', () => {
    const errorMessage = 'Invalid input';
    setup({
      isInvalid: true,
      errorMessage,
      label: 'Label',
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should hide description when size is small', () => {
    const description = 'Test description';
    setup({
      size: 'small',
      description,
      label: 'Label',
    });

    expect(screen.queryByText(description)).not.toBeInTheDocument();
  });

  it('should hide description when isInvalid', () => {
    const description = 'Test description';
    setup({
      isInvalid: true,
      description,
      label: 'Label',
    });

    expect(screen.queryByText(description)).not.toBeInTheDocument();
  });

  it('should show description when isDisabled', () => {
    const description = 'Test description';
    setup({
      isDisabled: true,
      description,
      label: 'Label',
    });

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  describe('prefix', () => {
    it('should render input with prefix', () => {
      const prefix = '$';
      setup({
        label: 'Price',
        inputProps: { prefix },
      });

      expect(screen.getByText(prefix)).toBeInTheDocument();
    });

    it('should pass prefix className through classNames', () => {
      const prefix = '€';
      const customClass = 'custom-prefix-class';
      setup({
        label: 'Price',
        inputProps: { prefix },
        classNames: {
          input: { prefix: customClass },
        },
      });

      const prefixElement = screen.getByText(prefix);
      expect(prefixElement.className).toContain(customClass);
    });
  });

  describe('suffix', () => {
    it('should render input with suffix', () => {
      const suffix = 'kg';
      setup({
        label: 'Weight',
        inputProps: { suffix },
      });

      expect(screen.getByText(suffix)).toBeInTheDocument();
    });

    it('should pass suffix className through classNames', () => {
      const suffix = '%';
      const customClass = 'custom-suffix-class';
      setup({
        label: 'Percentage',
        inputProps: { suffix },
        classNames: {
          input: { suffix: customClass },
        },
      });

      const suffixElement = screen.getByText(suffix);
      expect(suffixElement.className).toContain(customClass);
    });
  });

  describe('prefix and suffix together', () => {
    it('should render both prefix and suffix', () => {
      const prefix = '~';
      const suffix = '°C';
      setup({
        label: 'Temperature',
        inputProps: { prefix, suffix },
      });

      expect(screen.getByText(prefix)).toBeInTheDocument();
      expect(screen.getByText(suffix)).toBeInTheDocument();
    });

    it('should work with description', () => {
      const prefix = '$';
      const suffix = 'USD';
      const description = 'Enter amount in US dollars';
      setup({
        label: 'Amount',
        inputProps: { prefix, suffix },
        description,
      });

      expect(screen.getByText(description)).toBeInTheDocument();
      expect(screen.getByText(prefix)).toBeInTheDocument();
      expect(screen.getByText(suffix)).toBeInTheDocument();
    });

    it('should work with validation error', () => {
      const prefix = '$';
      const suffix = 'USD';
      const errorMessage = 'Amount is required';
      setup({
        label: 'Amount',
        inputProps: { prefix, suffix },
        isInvalid: true,
        errorMessage,
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(prefix)).toBeInTheDocument();
      expect(screen.getByText(suffix)).toBeInTheDocument();
    });
  });
});

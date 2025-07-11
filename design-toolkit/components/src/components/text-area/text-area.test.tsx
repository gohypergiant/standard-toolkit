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
import { TextArea } from './index';
import type { TextAreaFieldProps } from './types';

function setup({ ...props }: Partial<TextAreaFieldProps> = {}) {
  render(<TextArea {...props} />);

  return {
    ...props,
  };
}

describe('TextArea', () => {
  it('should render', () => {
    setup({
      label: 'Label',
      placeholder: 'Placeholder',
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Placeholder',
    );
  });

  it('should override defaults with props - size', () => {
    setup({
      size: 'small',
      label: 'Label',
      placeholder: 'Placeholder',
    });
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('text-body-xs');
  });

  it('should override defaults with props - isDisabled', () => {
    setup({
      isDisabled: true,
      label: 'Label',
      placeholder: 'Placeholder',
    });
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('text-disabled');
    expect(textarea).toHaveClass('outline-interactive-disabled');
  });

  it('should override defaults with props - isInvalid', () => {
    setup({
      isInvalid: true,
      label: 'Label',
      placeholder: 'Placeholder',
    });
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveClass('outline-serious');
  });

  it('should override defaults with props - isReadOnly', () => {
    setup({
      isReadOnly: true,
      label: 'Label',
      placeholder: 'Placeholder',
    });
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly', '');
    expect(textarea).toHaveClass('rounded-none');
    expect(textarea).toHaveClass('p-0');
    expect(textarea).toHaveClass('outline-none');
  });

  it('should fall back to TextAreaStylesDefaults if no props are provided', () => {
    setup({
      label: 'Label',
      placeholder: 'Placeholder',
    });

    const textarea = screen.getByRole('textbox');
    expect(textarea).not.toBeDisabled();
    expect(textarea).not.toHaveAttribute('aria-invalid');
    expect(textarea).not.toHaveAttribute('readonly');
    expect(textarea).toHaveClass('text-body-s');
    expect(textarea).not.toHaveClass('text-disabled');
    expect(textarea).not.toHaveClass('outline-serious');
    expect(textarea).not.toHaveClass('rounded-none');
  });

  it('should show error message when invalid', () => {
    const errorMessage = 'Invalid input';
    setup({
      isInvalid: true,
      errorMessage,
      label: 'Label',
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('fg-serious');
    expect(screen.getByText(errorMessage)).toHaveClass('text-body-xs');
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
    expect(screen.getByText(description)).toHaveClass('fg-disabled');
  });
});

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
import { TextAreaField } from './';
import type { TextAreaFieldProps } from './types';

function setup(props: Partial<TextAreaFieldProps> = {}) {
  return {
    ...render(<TextAreaField {...props} />),
    ...props,
  };
}

describe('TextAreaField', () => {
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
});

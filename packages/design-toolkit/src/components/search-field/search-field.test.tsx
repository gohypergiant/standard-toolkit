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
import { SearchField } from '@/components/search-field/index';
import { SearchFieldProvider } from './context';
import type { SearchFieldProps } from './types';

function setup({
  inputProps = { placeholder: 'Search' },
  'aria-label': ariaLabel = 'Search',
  ...rest
}: Partial<SearchFieldProps> = {}) {
  return {
    ...render(
      <SearchField {...rest} inputProps={inputProps} aria-label={ariaLabel} />,
    ),
    ...rest,
    inputProps,
    'aria-label': ariaLabel,
  };
}

describe('SearchField', () => {
  const placeholder = 'Search';

  it('should render', () => {
    setup();

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toBeInTheDocument();
  });

  it('should show loading state', () => {
    const className = 'loading-icon';

    setup({ classNames: { loading: className }, isLoading: true });

    const loadingIcon = document.getElementsByClassName(className)[0];

    // In loading state, the loading icon should be visible
    expect(loadingIcon).toBeInTheDocument();

    // and the clear button should not be visible
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should work with Provider context', () => {
    const value = 'hello world';

    render(
      <SearchFieldProvider value={value}>
        <SearchField aria-label='Context test' />
      </SearchFieldProvider>,
    );

    expect(screen.getByRole('searchbox')).toHaveValue(value);
  });

  it('should render with all classNames options', () => {
    const className = 'custom-search-field';

    const { container } = setup({
      classNames: {
        field: className,
        search: 'custom-search-icon',
        input: 'custom-input',
        loading: 'custom-loading-icon',
        clear: 'custom-clear-button',
      },
    });

    expect(container.firstChild).toHaveClass(className);
  });
});
